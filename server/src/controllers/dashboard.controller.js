import { AchievementService } from "../services/achievements.service.js";

import { PrismaClient } from "@prisma/client";
import { XpService } from "../services/xp.services.js";

const prisma = new PrismaClient();

export async function getOverviewData(req, res) {
    const userId = req.userId;

    try {
        // Dados do usuario
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
        const xp = userGamefication.totalXp;
        const level = XpService.getLevelFromTotalXp(xp);
        const nextLevelXp = XpService.xpToLevel(level+1);
        const xpProgress = XpService.calculateXpProgress(xp, level);

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
