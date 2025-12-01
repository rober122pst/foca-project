import { PrismaClient } from "@prisma/client";
import { generateId } from "../services/generateId.service.js";

const prisma = new PrismaClient();

export async function createPomodoroSession(req, res) {
    const userId = req.userId;
    const { eventId, plannedDuration, cicle } = req.body;

    try {
        const { id: profileId } = await prisma.profile.findUnique({ where: { userId }, select: { id: true } });

        const activeSession = await prisma.pomodoroSession.findFirst({
            where: {
                profileId,
                status: { in: ['RUNNING', 'PAUSED'] }
            }
        })

        if (activeSession) {
            const toleranceMinutes = 5; 
            const now = new Date();
            const lastClientPing = new Date(activeSession.lastClientPing);
            const diffMinutes = (now - lastClientPing) / 1000 / 60;

            if (diffMinutes > toleranceMinutes) {
                await prisma.pomodoroSession.update({
                    where: { id: activeSession.id },
                    data: { 
                        status: 'ABORTED', 
                        endedAt: now 
                    }
                });
                console.log(`Sessão zumbi ${activeSession.status} limpa.`);
            } else {
                // A sessão está ativa e recente. BLOQUEAR.
                return res.status(409).json({ message: 'Já existe uma sessão ativa em andamento' });
            }
        }

        const pomodoroSession = await prisma.pomodoroSession.create({
            data: {
                id: generateId(),
                profileId,
                eventId,
                plannedDuration,
                cicle,
                lastClientPing: new Date(),
            }
        });

        return res.json({ sessionId: pomodoroSession.id, message: 'Sessão criada com sucesso' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro no servidor' });
    }
}