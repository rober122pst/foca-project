import { calculateRoutineWeeklyPercent, calculateWeeklyRoutinesCompletion, checkRoutineToday, mapWeekdaysToNumbers } from "../services/routines.services.js";

import { PrismaClient } from "@prisma/client";
import { getUserAchievements } from "../services/achievements.service.js";
import { xpToNext } from "../services/xp.services.js";

const prisma = new PrismaClient();

export async function getOverviewData(req, res) {
    const userId = req.userId;

    try {
        // Dados do usuario
        const userData = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                profile: {
                    select: {
                        id: true,
                        gamefication: true,
                        routines: true,
                        tasks: true,
                        userAchiviements: true,
                    }
                }
            }
        })

        const userGamefication = userData.profile.gamefication; // tabela de gameficação
        const userTasks =  userData.profile.tasks; // lista de tarefas
        const completedTasks = userTasks.filter(task => task.completed).length; // tarefas completas
        const userRoutines = userData.profile.routines; // rotinas
        const routinesCount = userRoutines.length; // quantidade de rotinas
        const achievements = await getUserAchievements(prisma, userData.profile.id); // pega conquistas do jogador ordenadas por desbloqueadas e progresso

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
                nextLevelXp: userGamefication ? xpToNext(userGamefication.level) : xpToNext(1),
            },
            totalTasks: userTasks.length,
            taskList: [
                ...userTasks.slice(0, 4)
            ],
            achievements: achievements,
        })
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar dados do dashboard' });
        console.log(error)
    }
}

export async function getRoutinesData(req, res) {
    const userId = req.userId;

    try {
        const { routines } = await prisma.profile.findUnique({ 
            where: { userId },
            select: {
                routines: true,
            }
        });

        const activeRoutines = routines.length;
        const bestStreak = Math.max(...routines.map(r => r.streak), 0);
        const { rate: completionRate, totalCompleted: thisCompletedWeek, totalPossible: totalThisWeek } = calculateWeeklyRoutinesCompletion(routines);
        const { rate } = routines.map(routine => calculateRoutineWeeklyPercent(routine.days, routine.completedDays))
        const { didToday: completed } = routines.map(routine => checkRoutineToday(routine.days, routine.completedDays))

        return res.json({
            stats: {
                activeRoutines,
                bestStreak: bestStreak || 0,
                completionRate: completionRate || 0,
                thisCompletedWeek: thisCompletedWeek || 0,
                totalThisWeek: totalThisWeek || 0,
            },
            routines: routines.map(routine => ({
                ...routine,
                days: mapWeekdaysToNumbers(routine.days),
                rate: rate || 0,
                completed,
            })),
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar dados do dashboard' });
        console.log(error)
    }
}
