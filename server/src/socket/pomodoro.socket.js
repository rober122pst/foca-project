import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper to check abandonment
async function checkAbandonment(session) {
    if (!session || !session.event) return false;

    const now = new Date();
    // 2 hours in ms
    const TOLERANCE = 2 * 60 * 60 * 1000;

    if (now.getTime() > session.event.dtend.getTime() + TOLERANCE) {
        await prisma.pomodoroSession.update({
            where: { id: session.id },
            data: { status: 'ABANDONED' }
        });
        return true;
    }
    return false;
}

export default function pomodoroSocketHandler(io, socket) {

    socket.on('join_session', async (sessionId) => {
        socket.join(sessionId);
        socket.data.sessionId = sessionId; // Store for disconnect handler

        // Fetch session to check status/abandonment
        const session = await prisma.pomodoroSession.findUnique({
            where: { id: sessionId },
            include: { event: true, pomodoroBlocks: { orderBy: { sequenceOrder: 'asc' } } }
        });

        if (!session) {
            socket.emit('error', { message: 'Sessão não encontrada' });
            return;
        }

        if (await checkAbandonment(session)) {
            socket.emit('session_abandoned');
            return;
        }

        // Send current state
        socket.emit('session_update', session);
    });

    socket.on('start_timer', async ({ sessionId }) => {
        try {
            const session = await prisma.pomodoroSession.findUnique({
                where: { id: sessionId },
                include: { pomodoroBlocks: { orderBy: { sequenceOrder: 'asc' } } }
            });

            if (!session) return;

            // Find first pending/ready block
            // Logic: Find the active block or the first one if not started
            // In this simplistic model, we might just look for the first block without startTime
            // Or if the session is just created, start the first block.

            // However, the prompt implies complex flow. Let's look at the current block logic.
            // Usually we want to resume or start the *current* block.

            // Let's find the current block: The first one that is not finished?
            // "Finished" means `endTime` is set.
            // "Active" means `startTime` set but no `endTime`.

            let activeBlock = session.pomodoroBlocks.find(b => b.startTime && !b.endTime);
            let nextBlock = session.pomodoroBlocks.find(b => !b.startTime && !b.endTime);

            if (activeBlock) {
                 // Already active, just ensure status is running
                 if (session.status !== 'RUNNING') {
                     await prisma.pomodoroSession.update({ where: { id: sessionId }, data: { status: 'RUNNING' } });
                 }
                 io.to(sessionId).emit('timer_started', activeBlock);
                 return;
            }

            if (nextBlock) {
                // Start new block
                const updatedBlock = await prisma.pomodoroBlock.update({
                    where: { id: nextBlock.id },
                    data: { startTime: new Date() }
                });
                await prisma.pomodoroSession.update({ where: { id: sessionId }, data: { status: 'RUNNING' } });

                io.to(sessionId).emit('session_update', { ...session, status: 'RUNNING', pomodoroBlocks: session.pomodoroBlocks.map(b => b.id === updatedBlock.id ? updatedBlock : b) });
            }

        } catch (error) {
            console.error("Error starting timer:", error);
            socket.emit('error', { message: 'Erro ao iniciar timer' });
        }
    });

    socket.on('pause_timer', async ({ sessionId }) => {
        try {
            const now = new Date();

            // Update session status
            await prisma.pomodoroSession.update({
                where: { id: sessionId },
                data: { status: 'PAUSED' }
            });

            // Update block lastPauseTime
            // We need to find the currently active block
            const session = await prisma.pomodoroSession.findUnique({
                where: { id: sessionId },
                include: { pomodoroBlocks: true }
            });
            const activeBlock = session.pomodoroBlocks.find(b => b.startTime && !b.endTime);

            if (activeBlock) {
                await prisma.pomodoroBlock.update({
                    where: { id: activeBlock.id },
                    data: { lastPauseTime: now }
                });
            }

            io.to(sessionId).emit('timer_paused');

        } catch (error) {
            console.error(error);
        }
    });

    socket.on('resume_timer', async ({ sessionId }) => {
        try {
            const now = new Date();
            const session = await prisma.pomodoroSession.findUnique({
                where: { id: sessionId },
                include: { pomodoroBlocks: true }
            });

            const activeBlock = session.pomodoroBlocks.find(b => b.startTime && !b.endTime);

            if (activeBlock && activeBlock.lastPauseTime) {
                const pauseDuration = Math.floor((now.getTime() - activeBlock.lastPauseTime.getTime()) / 1000); // in seconds

                // Add to totalPauseTime (stored in seconds based on schema? Schema says Int. Let's assume seconds.)
                // Schema: totalPauseTime Int @default(0)

                await prisma.pomodoroBlock.update({
                    where: { id: activeBlock.id },
                    data: {
                        totalPauseTime: { increment: pauseDuration },
                        lastPauseTime: null // Clear it
                    }
                });
            }

            await prisma.pomodoroSession.update({
                where: { id: sessionId },
                data: { status: 'RUNNING' }
            });

            // Re-fetch to send updated data
            const updatedSession = await prisma.pomodoroSession.findUnique({
                 where: { id: sessionId },
                 include: { pomodoroBlocks: { orderBy: { sequenceOrder: 'asc' } } }
            });

            io.to(sessionId).emit('session_update', updatedSession);

        } catch (error) {
            console.error(error);
        }
    });

    socket.on('finish_block', async ({ sessionId, blockId }) => {
        try {
            const now = new Date();
            const block = await prisma.pomodoroBlock.findUnique({ where: { id: blockId } });

            if (!block || !block.startTime) {
                socket.emit('error', { message: 'Bloco inválido' });
                return;
            }

            // Validation: Calculate minimal expected duration
            // plannedDuration is in seconds (based on seed/logic: plannedDuration: duration * 60)
            const elapsedRaw = (now.getTime() - block.startTime.getTime()) / 1000;

            // If it was currently paused, we must account for the current pause session up to 'now'
            let currentPause = 0;
            if (block.lastPauseTime) {
                currentPause = (now.getTime() - block.lastPauseTime.getTime()) / 1000;
            }

            const totalPause = block.totalPauseTime + currentPause;
            const activeWork = elapsedRaw - totalPause;

            // Tolerance of 5 seconds (network latency etc)
            if (activeWork < block.plannedDuration - 5) {
                console.log(`Fraude detectada? Active: ${activeWork}, Planned: ${block.plannedDuration}`);
                socket.emit('error', { message: 'Tempo insuficiente para concluir o bloco.' });
                return;
                // Alternatively, we could force the timer to continue on client side.
            }

            // Close the block
            await prisma.pomodoroBlock.update({
                where: { id: blockId },
                data: {
                    endTime: now,
                    lastPauseTime: null, // Ensure clean state
                    totalPauseTime: Math.floor(totalPause) // commit the final pause time
                }
            });

            // Check if session is complete
             const session = await prisma.pomodoroSession.findUnique({
                where: { id: sessionId },
                include: { pomodoroBlocks: true }
            });

            const allComplete = session.pomodoroBlocks.every(b => b.endTime);
            if (allComplete) {
                await prisma.pomodoroSession.update({
                    where: { id: sessionId },
                    data: { status: 'COMPLETED' }
                });
            } else {
                 // Maybe auto-start next? Or wait for user?
                 // Usually wait for user to start next block (Break or Focus).
                 // But wait, the breaks are also blocks? Yes.
                 // "blocksData.push ... type: 'BREAK'"
                 // So "finish_block" applies to breaks too.
            }

             const finalSession = await prisma.pomodoroSession.findUnique({
                 where: { id: sessionId },
                 include: { pomodoroBlocks: { orderBy: { sequenceOrder: 'asc' } } }
            });

            io.to(sessionId).emit('session_update', finalSession);

        } catch (error) {
            console.error(error);
        }
    });

    socket.on('disconnect', async () => {
        const sessionId = socket.data.sessionId;
        if (sessionId) {
            console.log(`Socket ${socket.id} disconnected from session ${sessionId}`);

            // Check if any clients remain in the session room
            const room = io.sockets.adapter.rooms.get(sessionId);
            if (room && room.size > 0) {
                return;
            }

            // Auto-pause if running
            try {
                 const session = await prisma.pomodoroSession.findUnique({
                    where: { id: sessionId },
                    include: { pomodoroBlocks: true }
                });

                if (session && session.status === 'RUNNING') {
                    const now = new Date();
                    await prisma.pomodoroSession.update({
                        where: { id: sessionId },
                        data: { status: 'PAUSED' }
                    });

                    const activeBlock = session.pomodoroBlocks.find(b => b.startTime && !b.endTime);
                    if (activeBlock) {
                        await prisma.pomodoroBlock.update({
                            where: { id: activeBlock.id },
                            data: { lastPauseTime: now }
                        });
                    }

                    // Notify room (in case other devices are connected? Or just for logging)
                    io.to(sessionId).emit('timer_paused', { reason: 'disconnect' });
                }
            } catch (e) {
                console.error("Error handling disconnect:", e);
            }
        }
    });
}
