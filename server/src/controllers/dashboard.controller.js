import { AchievementService } from "../services/achievements.service.js";

import { PrismaClient } from "@prisma/client";
import { XpService } from "../services/xp.services.js";

// inicia o prisma para ter acesso ao banco de dados
const prisma = new PrismaClient();

export async function getOverviewData(req, res) {
    const userId = req.userId;

    try {
        // busca dados do usuario e outras tabelas usadas no dashboard
        const userData = await prisma.user.findUnique({
            where: { id: userId, },
            select: {
                profile: {
                    select: {
                        id: true,
                        gamefication: true,
                        events: { where: { type: { in: ['TASK', 'PROJECT'] } } },
                        tasks: true,
                        userAchiviements: true,
                        pomodorosSessions: true,
                    }
                }
            }
        })

        const userGamefication = userData.profile.gamefication; // tabela de gameficação
        const userEvents = userData.profile.events; // rotinas
        const userTasks =  userEvents.filter((e) => e.type === 'TASK'); // lista de tarefas
        const userProjects =  userEvents.filter((e) => e.type === 'PROJECT');
        const projectsCount = userProjects.length; // quantidade de projetos
        const achievements = await AchievementService.getUserAchievements(prisma, userData.profile.id); // pega conquistas do jogador ordenadas por desbloqueadas e progresso
        const xp = userGamefication.totalXp; // quantidade de xp do usuario
        const level = XpService.getLevelFromTotalXp(xp); // calcula level de acordo com XP atual
        const nextLevelXp = XpService.xpToLevel(level+1); // progresso até proximo nivel
        const xpProgress = XpService.calculateXpProgress(xp, level); // calcula progresso de xp até o momento

        // retorna estatísticas gerais, progresso de level, tarefas e conquistas.
        return res.json({
            stats: {
                streak: userGamefication?.streakCurrent || 0,
                totalTimeFocused: userGamefication?.totalTimeFocus || 0,
                totalSessions: userData.profile.pomodorosSessions.length,
                activeEvents: projectsCount
            },
            levelProgress: {
                level: level,
                currentXp: xp,
                nextLevelXp,
                xpProgress,
            },
            totalTasks: userTasks.length,
            taskList: [
                ...userTasks.slice(0, 4)
            ],
            achievements: achievements,
        })
    // caso algo dê errado, retorna erro e envia mensagem indicando o problema
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar dados do dashboard' });
        console.log(error)
    }
}

// busca e retorna todos os eventos do usuário, junto com estatisticas do dia
export async function getEventsData(req, res) {
    const userId = req.userId;

    try {
        // define o horario inicial do dia (00:00)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        
        // define o horario final do dia (23:59)
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999)

        // busca eventos do usuario e ordenados
        const events = await prisma.event.findMany({ 
            where: { profile: { userId } },
            orderBy: [
                { dtstart: 'asc' },
                { createdAt: 'asc' },
            ], // incluindo eventos completos do dia
            include: {
                eventCompletions: {
                    where: {
                        occurrenceDate: {
                            gte: todayStart,
                            lte: todayEnd,
                        },
                    },
                },
            },
        });

        // quantidade total de eventos ativos
        const activeEvents = events.length;
        // pega a maior sequência contínua (streak) entre os eventos
        const bestStreak = Math.max(...events.map(e => e.streak), 0);

        // Retorna eventos com informações básicas e se foram concluídos hoje
        return res.json({
            stats: {
                activeEvents,
                bestStreak,
                completionRate: 0,
                thisCompletedWeek: 0,
                totalThisWeek: 0,
            },
            events: events.map((event) => ({
                ...event,
                eventCompletions: undefined,
                completed: event.eventCompletions.length > 0,
            })),
        });
    
    //  caso algo dê errado, retorna erro e envia mensagem indicando o problema
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar dados do dashboard' });
        console.log(error)
    }
}
