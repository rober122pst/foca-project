import pkg from 'rrule';
import prisma from "../prisma.js";
import { AchievementService } from '../services/achievements.service.js';
import { XpService } from "../services/xp.services.js";

const { RRule } = pkg;

async function checkAbandonment(session) {
    if (!session || !session.event) return false;

    const now = new Date();
    const TOLERANCE = 2 * 60 * 60 * 1000; // 2 horas

    let effectiveEndTime;

    // Se NÃO tem recorrência, usa o dtend original do banco
    if (!session.event.rrule) {
        effectiveEndTime = new Date(session.event.dtend);
    } 
    // Se TEM recorrência, precisamos calcular o fim desta ocorrência específica
    else {
        try {
            const originalStart = new Date(session.event.dtstart);
            const originalEnd = new Date(session.event.dtend);
            
            // 1. Descobre a duração do evento (ex: 1 hora)
            const duration = originalEnd.getTime() - originalStart.getTime();

            // 2. Configura a regra
            const ruleOptions = RRule.parseString(session.event.rrule);
            ruleOptions.dtstart = originalStart;
            const rule = new RRule(ruleOptions);

            // 3. Pega a ocorrência mais recente que começou antes (ou exatamente) agora.
            // O 'true' no segundo argumento indica 'inclusivo'.
            const currentOccurrenceStart = rule.before(now, true);

            if (!currentOccurrenceStart) {
                // Se por algum motivo não achou ocorrência anterior (ex: evento futuro), 
                // fallback para o original ou retorna false para não bugar.
                // Mas assumindo que a sessão existe, deve haver uma ocorrência.
                return false; 
            }

            // 4. Calcula o fim real dessa ocorrência específica
            effectiveEndTime = new Date(currentOccurrenceStart.getTime() + duration);

        } catch (error) {
            console.error("Erro ao calcular data de abandono recorrente:", error);
            // Em caso de erro, evita marcar como abandonado prematuramente
            return false;
        }
    }

    // Agora a comparação é feita com o horário correto do dia atual
    if (now.getTime() > effectiveEndTime.getTime() + TOLERANCE) {
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
                 // Already active. Check if it was paused.
                 if (activeBlock.lastPauseTime) {
                     // If it was paused, we should resume it instead of just starting.
                     // Calculate pause duration since lastPauseTime
                     const now = new Date();
                     const pauseDuration = Math.floor((now.getTime() - activeBlock.lastPauseTime.getTime()) / 1000);

                     await prisma.pomodoroBlock.update({
                        where: { id: activeBlock.id },
                        data: {
                            totalPauseTime: { increment: pauseDuration },
                            lastPauseTime: null
                        }
                    });
                 }

                 // ensure status is running
                 if (session.status !== 'RUNNING') {
                     await prisma.pomodoroSession.update({ where: { id: sessionId }, data: { status: 'RUNNING' } });
                 }

                 // Refetch to get updated block
                 const updatedSession = await prisma.pomodoroSession.findUnique({
                    where: { id: sessionId },
                    include: { pomodoroBlocks: { orderBy: { sequenceOrder: 'asc' } } }
                });

                 io.to(sessionId).emit('session_update', updatedSession);
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
                io.to(sessionId).emit('timer_started', updatedBlock);
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
                console.log(`Resuming session ${sessionId}. Added pause duration: ${pauseDuration}s`);

                await prisma.pomodoroBlock.update({
                    where: { id: activeBlock.id },
                    data: {
                        totalPauseTime: { increment: pauseDuration },
                        lastPauseTime: null // Clear it
                    }
                });
            } else if (activeBlock && !activeBlock.lastPauseTime && session.status === 'PAUSED') {
                // Edge case: Status is PAUSED but lastPauseTime is missing.
                // This shouldn't happen unless manual DB edit or bug.
                // We should probably just resume without adding pause time (loss of pause tracking)
                // or assume we paused "now"? No.
                console.warn(`Resuming session ${sessionId} but lastPauseTime is missing on active block.`);
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
            io.to(sessionId).emit('timer_resumed');

        } catch (error) {
            console.error(error);
        }
    });

    socket.on('reset_block', async ({ sessionId }) => {
        try {
            const session = await prisma.pomodoroSession.findUnique({
                where: { id: sessionId },
                include: { pomodoroBlocks: true }
            });

            // Find current active block
            const activeBlock = session.pomodoroBlocks.find(b => b.startTime && !b.endTime);
            if (!activeBlock) return;

            // Reset block data
            await prisma.pomodoroBlock.update({
                where: { id: activeBlock.id },
                data: {
                    startTime: null,
                    endTime: null,
                    lastPauseTime: null,
                    totalPauseTime: 0
                }
            });

            // Set session to WAITING if it's the first block, or just PAUSED?
            // User requested "reset timer of that block".
            // If we nullify startTime, it's like it never started.
            // If it's the first block, session should be WAITING.

            let newStatus = 'PAUSED';
            if (activeBlock.sequenceOrder === 1) {
                newStatus = 'WAITING';
            }

            await prisma.pomodoroSession.update({
                where: { id: sessionId },
                data: { status: newStatus }
            });

             const updatedSession = await prisma.pomodoroSession.findUnique({
                 where: { id: sessionId },
                 include: { pomodoroBlocks: { orderBy: { sequenceOrder: 'asc' } } }
            });

            io.to(sessionId).emit('session_update', updatedSession);
        } catch (error) {
            console.error("Error resetting block:", error);
        }
    });

    socket.on('finish_block', async ({ sessionId, blockId }) => {
        console.log('finalizou o bloco')
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

            const { id: gameficationId } = await prisma.gamefication.findUnique({
                where: { profileId: session.profileId },
                select: { id: true },
            });

            const xpReward = Math.floor(100 + (1.5 * (block.plannedDuration / 60)));

            if (block.type === 'FOCUS') {
                await XpService.giveXp(gameficationId, xpReward, 'Bloco Finalizado');
                await prisma.gamefication.update({
                    where: { profileId: session.profileId },
                    data: { 
                        totalTimeFocus: {
                            increment: Math.round(block.plannedDuration / 60),
                        },
                    }
,               });
            }
            
            const allComplete = session.pomodoroBlocks.every(b => b.endTime);
            if (allComplete) {
                await XpService.giveXp(gameficationId, xpReward*2, 'Pomodoro Finalizado')
                await prisma.pomodoroSession.update({
                    where: { id: sessionId },
                    data: { status: 'COMPLETED' }
                });
                await AchievementService.processEvent({
                    profileId: session.profileId,
                    type: 'POMODORO_FINISHED',
                    data: {
                        timestamp: new Date(),
                        amount: 1,
                    }
                })
            }

            console.log(xpReward)

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
