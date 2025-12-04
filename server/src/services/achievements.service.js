import { PrismaClient } from "@prisma/client";
import { generateId } from "./generateId.service.js";

const prisma = new PrismaClient();

export class AchievementService {
    static async getUserAchievements(prisma, profileId, take = 4) {
        // Busca todas as conquistas + progresso do usuário (se existir)
        const achievements = await prisma.achiviement.findMany({
            include: {
                userAchiviements: {
                    where: { profileId },
                    take: 1,
                },
            },
        });

        // Agora transformamos para um array com dados unificados
        const mapped = achievements.map(a => {
            const ua = a.userAchiviements[0];

            return {
                id: a.id,
                name: a.name,
                description: a.description,
                icon: a.iconUrl,
                total: a.total ?? null,
                rarity: a.rarity,
                xpReward: a.xpReward,
                coinReward: a.coinReward,
                progress: ua?.progress ?? 0,
                unlocked: ua?.achievedAt ? true : false,
                achievedAt: ua?.achievedAt ?? null,
            };
        });

        // Ordenação:
        // 1. Desbloqueadas primeiro (achievedAt != null)
        // 2. Dentro delas → mais recentes primeiro
        // 3. Depois bloqueadas → maior progresso/total primeiro
        const ordered = mapped.sort((a, b) => {
            // a desbloqueada e b não
            if (a.achievedAt && !b.achievedAt) return -1;
            if (!a.achievedAt && b.achievedAt) return 1;

            // Se ambas desbloqueadas → ordena por achievedAt DESC
            if (a.achievedAt && b.achievedAt) {
                return new Date(b.achievedAt) - new Date(a.achievedAt);
            }

            // Se ambas bloqueadas → ordena por % de progresso
            const progressA = a.total === null ? 0 : a.progress / a.total;
            const progressB = b.total === null ? 0 : b.progress / b.total;

            return progressB - progressA;
        });

        // Retorna só 4 itens
        return ordered.slice(0, take);
    }

    /**
     * Processa um evento do sistema e atualiza/desbloqueia conquistas.
     */
    static async processEvent(event) {
        const { profileId, type, data } = event;
        const now = data?.timestamp || new Date();

        // 1. Mapear o evento do sistema para os tipos de critérios do CSV
        // Isso evita buscar todas as conquistas do banco, buscando apenas as relevantes.
        let relevantCriteriaTypes = [];

        switch (type) {
            case 'TASK_FINISHED':
                relevantCriteriaTypes = ['task_complete', 'task_time_range'];
                break;
            case 'POMODORO_FINISHED':
                relevantCriteriaTypes = ['pomodoro', 'pomodoro_period'];
                break;
            case 'COINS_ADDED':
                relevantCriteriaTypes = ['coins_earned'];
                break;
            case 'LEVEL_UP':
                relevantCriteriaTypes = ['reach_level'];
                break;
            case 'SOCIAL_ACTION':
                // Mapeia sub-ações sociais baseadas no payload
                if (data?.actionType === 'add_friend') relevantCriteriaTypes.push('add_friend');
                if (data?.actionType === 'share') relevantCriteriaTypes.push('share_progress');
                if (data?.actionType === 'invite') relevantCriteriaTypes.push('invite_register');
                break;
        }

        if (relevantCriteriaTypes.length === 0) return;

        // 2. Buscar definições de conquistas relevantes no banco
        // Assumindo que o JSON do CSV foi salvo num campo 'criteria' no modelo Achiviement
        // Nota: O Prisma permite filtrar JSON, mas aqui faremos em memória para garantir compatibilidade
        const allDefinitions = await prisma.achiviement.findMany({
            where: {
                // OR: relevantCriteriaTypes.map(t => ({
                //     criteria: {
                //     path: ["type"],
                //     string_contains: t
                //     }
                // }))
            }
        });

        
        // Filtra em memória as definições que batem com os tipos relevantes
        const definitions = allDefinitions.filter(def => {
            const criteria = JSON.parse(def.criteria); // Cast do JSON
            return relevantCriteriaTypes.includes(criteria.type);
        });
        
        // 3. Iterar e atualizar o progresso do usuário
        for (const def of definitions) {
            await this.updateProgress(profileId, def, data);
        }
    }

    static async updateProgress(profileId, definition, eventData) {
        const criteria = JSON.parse(definition.criteria);
        
        // Busca ou cria o registro de progresso do usuário
        let userAchiev = await prisma.userAchiviement.findUnique({
            where: {
                profileId_achiviementId: {
                    profileId: profileId,
                    achiviementId: definition.id,
                },
            },
        });

        // Se já completou, ignora (a menos que seja repetível, mas o modelo tem achievedAt único)
        if (userAchiev?.achievedAt) return;

        if (!userAchiev) {
            userAchiev = await prisma.userAchiviement.create({
                data: {
                    id: generateId(),
                    profileId: profileId,
                    achiviementId: definition.id,
                    progress: 1,
                },
            });
        }

        let increment = 0;
        let shouldUpdate = false;

        // --- LÓGICA DE VALIDAÇÃO DOS CRITÉRIOS ---
        
        // Caso 1: Time Range (Ex: "Madrugador")
        if (criteria.type === 'task_time_range' && eventData.timestamp) {
        const hour = eventData.timestamp.getHours();
        const minute = eventData.timestamp.getMinutes();
        const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        
        if (criteria.from && criteria.to) {
            if (timeString >= criteria.from && timeString <= criteria.to) {
                increment = 1;
                shouldUpdate = true;
            }
        }
        }
        
        // Caso 2: Acumuladores Simples (Tarefas, Pomodoros, Ações Sociais)
        else if (['task_complete', 'pomodoro', 'pomodoro_period', 'add_friend', 'share_progress', 'checklist_complete'].includes(criteria.type)) {
            increment = 1;
            shouldUpdate = true;
        }

        // Caso 3: Moedas (Valor absoluto ou acumulativo)
        else if (criteria.type === 'coins_earned' && eventData.amount) {
        // Se for "Tenha 1000 moedas" (estado) vs "Ganhe 1000 moedas" (acumulo).
        // Vou assumir acumulo baseado no CSV "Acumule 1000 moedas"
        increment = eventData.amount; 
        shouldUpdate = true;
        }

        // Caso 4: Nível (Estado absoluto)
        else if (criteria.type === 'reach_level' && eventData.currentLevel) {
        // Aqui sobrescrevemos o progresso com o nível atual
        if (eventData.currentLevel > userAchiev.progress) {
            userAchiev.progress = eventData.currentLevel;
            shouldUpdate = true;
            // Zera o incremento pois já setamos direto
            increment = 0; 
        }
        }

        // --- ATUALIZAÇÃO NO BANCO ---

        if (shouldUpdate) {
            const newProgress = userAchiev.progress + increment;
            const target = criteria.target;
            const isCompleted = newProgress >= target;
            await prisma.userAchiviement.update({
                where: { id: userAchiev.id },
                data: {
                    progress: newProgress,
                    achievedAt: isCompleted ? new Date() : null,
                },
            });
            
            if (isCompleted) {
                console.log(`🏆 Conquista Desbloqueada: ${definition.name}!`);
                // Aqui você chamaria o serviço para dar as recompensas (XP, Coins) ao usuário
                // this.rewardService.grant(profileId, definition.xpReward, definition.coinReward);
            }
        }

    }
}