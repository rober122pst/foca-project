import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getOverviewData(req, res) {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "Acesso Negado" });
    }

    try {
        const userGamefication = await prisma.gamefication.findUnique({ where: { userId } });
        const userTasks = await prisma.task.findMany({ where: { userId } });
        const completedTasks = userTasks.filter(task => task.completed).length;
        const userRoutines = await prisma.routine.findMany({ where: { userId } });
        const routinesCount = userRoutines.length;
        const userAchievements = await prisma.userAchiviement.findMany({ where: { userId } })

        return res.json({
            stats: {
                streak: userGamefication?.streakCurrent || 0,
                totalTimeFocused: 93, // TODO: fazer isso aqui depois
                completedTasks: completedTasks,
                activeRoutines: routinesCount
            },
            levelProgress: {
                level: userGamefication?.level || 1,
                currentXp: userGamefication?.currentXp || 0,
                nextLevelXp: userGamefication ? (userGamefication.level + 1) * 100 : 100
            },
            taskList: [
                ...userTasks.slice(0, 4)
            ],
            achievements: userAchievements,
        })
    } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
    }
}
