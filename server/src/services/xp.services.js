import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export class XpService {
    /**
     * 
     * @param {number} level 
     * @returns {number} Calcula quanto de Xp precisa para upar o level
     */
    static xpToNext(level) {
        return Math.floor(200 * (1.03 ** (level - 1)) + 100 * level);
    }
    
    static xpToLevel(level) {
        
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

        const newTotalXp = gamefication.xp + amount;

        const processed = this.processLevelUp(
            newTotalXp,
            gamefication.level
        );

        await prisma.gamefication.update({
            where: { id: gameficationId },
            data: {
                xp: processed.remainingXp,
                level: processed.level,
            }
        });

        return processed;
    }

    /**
     * 
     * @param {number} currentXp Xp atual
     * @param {number} level 
     * @returns {object} { level, remainingXp, xpToNext }
     */
    static processLevelUp(currentXp, level) {
        let xpToNext = this.xpToNext(level);

        // Vai subiindo o level até o xp ficar menor aí
        while (currentXp >= xpToNext) {
            console.log(level, currentXp, xpToNext);
            level++;
            currentXp -= xpToNext;
            xpToNext = this.xpToNext(level);
        }

        return {
            level,
            remainingXp: currentXp,
            xpToNext
        }
    }
}