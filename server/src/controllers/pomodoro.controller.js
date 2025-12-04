import { generateId, verifyUuid } from "../services/generateId.service.js";

import { PrismaClient } from "@prisma/client";
import { calcularBlocosFoco } from "../services/pomodoro.service.js";

const prisma = new PrismaClient();

export async function createPomodoroSession(req, res) {
    const userId = req.userId;
    const { eventId, plannedDuration } = req.body;

    try {
        const { id: profileId } = await prisma.profile.findUnique({ where: { userId }, select: { id: true } });

        const activeSession = await prisma.pomodoroSession.findFirst({
            where: {
                profileId,
                status: {
                    in: ['RUNNING', 'PAUSED', 'WAITING']
                }
            }
        })

        if (activeSession) {
            return res.status(409).json({ message: 'Já existe uma sessão ativa em andamento' });
        }

        const { blocks } = calcularBlocosFoco(plannedDuration);

        const blocksData = [];

        blocks.forEach((duration, index) => {
            blocksData.push({
                id: generateId(),
                sequenceOrder: (index * 2) + 1,
                plannedDuration: duration * 60,
                type: 'FOCUS',
            });
            
            if (index < blocks.length - 1) {
                blocksData.push({
                    id: generateId(),
                    sequenceOrder: (index * 2) + 2,
                    plannedDuration: 5 * 60,
                    type: 'BREAK',
                });
            }
        });

        // Initial status is WAITING until they actually click start, but previous code used RUNNING.
        // Given the requirement "autostart" or "manual start", usually manual.
        // I'll set it to WAITING so it doesn't count as "Running" immediately if we want them to click Start.
        // But the previous code set it to RUNNING immediately.
        // However, we want to prevent concurrent sessions.
        // If I set it to WAITING, does it block new ones? The check above checks RUNNING/PAUSED.
        // Let's stick to WAITING for clean start, or RUNNING if that's the desired UX (auto-start).
        // The `pomodoroStart` controller suggests manual start was possible.
        // Let's set to WAITING so the user has to click "Start" via socket.

        const pomodoroSession = await prisma.$transaction(async (tx) => {
            const session = await tx.pomodoroSession.create({
                data: {
                    id: generateId(),
                    profileId,
                    eventId: eventId,
                    totalPlannedTime: blocksData.reduce((acc, b) => acc + b.plannedDuration, 0),
                    totalCycles: blocks.length,
                    status: 'WAITING',
                    pomodoroBlocks: {
                        create: blocksData,
                    },
                }
            });
            return session;
        });

        return res.json({ sessionId: pomodoroSession.id, message: 'Sessão criada com sucesso' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro no servidor' });
    }
}

export async function getPomodoroSession(req, res) {
    const userId = req.userId;
    const { id } = req.params

    
    try {
        if (!verifyUuid(id)) {
            return res.status(400).json({ message: "ID inválido." });
        }
        
        const pomodoroSession = await prisma.pomodoroSession.findFirst({ 
            where: { profile: { userId }, id: id },
            include: { pomodoroBlocks: true }
        });
        
        if (!pomodoroSession) {
            return res.status(404).json({ message: "Pomodoro não encontrado" });
        }

        return res.json(pomodoroSession);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Erro no servidor" })
    }
}
