import prisma from "../prisma.js";

export async function getTimeDistribution(userId) {
    const sessions = await prisma.pomodoroSession.findMany({
        where: { profile: { userId } },
        include: {
            event: {
                select: { tag: true },
            },
        },
    });

    const result = {};

    for (const s of sessions) {
        const tag = s.event?.tag || "other";

        if (!result[tag]) {
        result[tag] = 0;
        }

        result[tag] += Math.floor(s.totalPlannedTime / 60);
    }

    const colors = ['#ff0546', '#9c173b', '#450327', '#17001d', '#0098db']

    // Transforma o mapa em array para o front.
    return Object.entries(result).map(([label, minutes], index) => ({
        label,
        minutes,
        color: colors[index],
    }));

}