import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export class XpService {
    /**
     * 
     * @param {number} level 
     * @returns {number} Calcula quanto de Xp precisa para upar o level
     */
    static xpToNext(level) {
        return Math.floor(150 + (4 * (level ** 2)));
    }
    
    /**
     * 
     * @param {number} targetLevel 
     * @returns Total de Xp para esse level
     */
    static xpToLevel(targetLevel) {
        let totalXp = 0;
        for (let i = 1; i < targetLevel; i++) {
            const xpForThisStep = this.xpToNext(i);
            totalXp += Math.floor(xpForThisStep);
        }

        return totalXp;
    }

    static getLevelFromTotalXp(totalXp) {
        let level = 1;
        let xpAccumulated = 0;

        while (true) {
            // Calcula quanto custa ir para o próximo
            const xpNext = this.xpToNext(level);
            
            // Se a soma passar do que o usuário tem, paramos aqui
            if (xpAccumulated + xpNext > totalXp) {
                return level;
            }
            
            xpAccumulated += xpNext;
            level++;
            
            if (level >= 100) return 100; // Cap máximo
        }
    }
    
    /**
     * Função pra dar Xp
     * @param {string} gameficationId - Id do perfil 
     * @param {number} amount - Quantidade de XP 
     * @param {string} reason - Motivo 
     */
    static async giveXp(gameficationId, amount, reason) {
        if (amount <= 0) return;

        // TODO: criar depois uma tabela pra historico do XP

        const gamefication = await prisma.gamefication.findUnique({
            where: { id: gameficationId },
            select: { xp: true, level: true },
        })

        if (!gamefication) { console.log("Gamificação não encontrada."); return; } 

        const newTotalXp = gamefication.totalXp + amount;

        await prisma.gamefication.update({
            where: { id: gameficationId },
            data: {
                totalXp: newTotalXp,
            }
        });

        return processed;
    }

    static calculateXpProgress(totalXp, currentLevel) {
        const startOfLevelXp = this.xpToLevel(currentLevel);
        
        const levelSize = this.xpToNext(currentLevel); 

        const xpIntoLevel = totalXp - startOfLevelXp;

        if (currentLevel >= 100) return 100;

        let progress = (xpIntoLevel / levelSize) * 100;

        return Math.min(100, Math.max(0, progress));
    }
}