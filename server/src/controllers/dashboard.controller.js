import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getOverviewData(req, res) {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "Acesso Negado" });
    }

    try {
        const userData = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                profile: {
                    select: {
                        gamefication: true,
                        routines: true,
                        tasks: true,
                        userAchiviements: true,
                    }
                }
            }
        })

        const userGamefication = userData.profile.gamefication;
        const userTasks =  userData.profile.tasks;
        const completedTasks = userTasks.filter(task => task.completed).length;
        const userRoutines = userData.profile.routines;
        const routinesCount = userRoutines.length;
        const userAchievements = userData.profile.userAchiviements;

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
        res.status(500).json({ message: 'Erro ao buscar dados do dashboard' });
        console.log(error)
    }
}
