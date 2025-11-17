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
        
    }
}