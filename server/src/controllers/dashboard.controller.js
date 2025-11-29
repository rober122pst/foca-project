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
                        events: true,
                        tasks: true,
                        userAchiviements: true,
                    }
                }
            }
        })

        const userGamefication = userData.profile.gamefication; // tabela de gameficação
        const userTasks =  userData.profile.tasks; // lista de tarefas
        const completedTasks = userTasks.filter(task => task.completed).length; // tarefas completas
        const userEvents = userData.profile.events; // rotinas
        const eventsCount = userEvents.length; // quantidade de rotinas
        const achievements = await getUserAchievements(prisma, userData.profile.id); // pega conquistas do jogador ordenadas por desbloqueadas e progresso

        return res.json({
            stats: {
                streak: userGamefication?.streakCurrent || 0,
                totalTimeFocused: 93, // TODO: fazer isso aqui depois
                completedTasks: completedTasks,
                activeEvents: eventsCount
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

export async function getEventsData(req, res) {
    const userId = req.userId;

    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999)

        const events = await prisma.event.findMany({ 
            where: { profile: { userId } },
            orderBy: [
                { dtstart: 'asc' },
                { createdAt: 'asc' },
            ],
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

        const activeEvents = events.length;
        const bestStreak = Math.max(...events.map(e => e.streak), 0);


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
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar dados do dashboard' });
        console.log(error)
    }
}
