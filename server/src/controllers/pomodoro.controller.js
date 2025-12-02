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
                status: 'RUNNING'
            }
        })

        if (activeSession) {
            console.log(`Sessão zumbi ${activeSession.status} limpa.`);
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

        const pomodoroSession = await prisma.$transaction(async (tx) => {
            const session = await tx.pomodoroSession.create({
                data: {
                    id: generateId(),
                    profileId,
                    eventId: eventId,
                    totalPlannedTime: blocksData.reduce((acc, b) => acc + b.plannedDuration, 0),
                    totalCycles: blocks.length,
                    status: 'RUNNING',
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

export async function pomodoroStart(req, res) {
    const userId = req.userId;
    const { sessionId } = req.params;

    try {
        const firstBlock = await prisma.pomodoroBlock.findFirst({
            where: { session: { id: sessionId, profile: { userId } }, sequenceOrder: 1 }
        })

        await prisma.pomodoroBlock.update({
            where: { id: firstBlock.id },
            data: { startTime: new Date() }
        })
        res.json({ message: 'Pomodoro iniciado' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Erro no servidor" })
    }
} 