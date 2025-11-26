import { generateId, verifyUuid } from "../services/generateId.service.js";
import { calculateRoutineWeeklyPercent, checkRoutineToday } from "../services/routines.services.js";

import { PrismaClient } from "@prisma/client";
import { mapWeekdaysToNumbers } from "../services/routines.services.js";

const prisma = new PrismaClient();

export async function createRoutine(req, res) {
    const userId = req.userId;
    const { title, description, days, color, startTime, endTime, tag } = req.body;

    try {

        const { id: profileId } = await prisma.profile.findUnique({ where: { userId }, select: { id: true } })

        const newRoutine = await prisma.routine.create({
            data: {
                id: generateId(),
                profileId,
                title,
                tag,
                description,
                days,
                color,
                startTime,
                endTime
            }
        });

        return res.status(201).json(newRoutine);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro ao postar dados' });
    }
}  

export async function getRoutines(req, res) {
    const userId = req.userId;
    
    try {
        const { routines } = await prisma.profile.findUnique({ 
            where: { userId },
            select: {
                routines: true,
            },
        });

        const { rate } = routines.map(routine => calculateRoutineWeeklyPercent(routine.days, routine.completedDays));
        const { didToday: completed } = routines.map(routine => checkRoutineToday(routine.days, routine.completedDays));

        return res.json(routines.map(routine => ({
            ...routine,
            days: mapWeekdaysToNumbers(routine.days),
            rate: rate || 0,
            completed,
        })));
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro no servidor" });
    }
}

export async function getRoutineById(req, res) {
    const userId = req.userId;
    
    try {
        const { routineId } = req.params

        if (!verifyUuid(routineId)) {
            return res.status(400).json({ message: "ID inválido." });
        }

        const profile = await prisma.profile.findUnique({ 
            where: { userId },
            select: {
                id: true,
            },
        });

        if (!profile) {
            return res.status(404).json({ message: "Perfil não encontrado" });
        }

        const profileId = profile.id;

        const routine = await prisma.routine.findUnique({
            where: {
                profileId,
                id: routineId,
            },
        });

        if (!routine) {
            return res.status(404).json({ message: "Rotina não encontrada" });
        }

        const { rate } = calculateRoutineWeeklyPercent(routine.days, routine.completedDays)
        const { didToday: completed } = checkRoutineToday(routine.days, routine.completedDays)

        return res.json({
            ...routine,
            days: mapWeekdaysToNumbers(routine.days),
            rate: rate || 0,
            completed,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Erro no servidor" })
    }
}

export async function updateRoutine(req, res) {
    const userId = req.userId;
    
    try {
        const { routineId } = req.params;

        if (!verifyUuid(routineId)) {
            return res.status(400).json({ message: "ID inválido." });
        }

        const profile = await prisma.profile.findUnique({ 
            where: { userId },
            select: {
                id: true,
            },
        });

        if (!profile) {
            return res.status(404).json({ message: "Perfil não encontrado" });
        }

        const profileId = profile.id;

        const updateRoutine = await prisma.routine.update({
            where: {
                profileId,
                id: routineId,
            },
            data: req.body,
        });

        if (!updateRoutine) {
            return res.status(404).json({ message: "Rotina não encontrada" });
        }

        const { rate } = calculateRoutineWeeklyPercent(updateRoutine.days, updateRoutine.completedDays);
        const { didToday: completed } = checkRoutineToday(updateRoutine.days, updateRoutine.completedDays);

        return res.json({
            ...updateRoutine,
            days: mapWeekdaysToNumbers(updateRoutine.days),
            rate: rate || 0,
            completed,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro no servidor" });
    }
}

export async function deleteRoutine(req, res) {
        const userId = req.userId;
    
    try {
        const { routineId } = req.params;

        if (!verifyUuid(routineId)) {
            return res.status(400).json({ message: "ID inválido." });
        }

        const profile = await prisma.profile.findUnique({ 
            where: { userId },
            select: {
                id: true,
            },
        });

        if (!profile) {
            return res.status(404).json({ message: "Perfil não encontrado" });
        }

        const profileId = profile.id;

        const result = await prisma.routine.delete({ 
            where: { profileId, id: routineId },
        })

        if (!result) {
            return res.status(404).json({ message: "Rotina não encontrada" });
        }

        return res.json({ message: 'Rotina deletada' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro no servidor" });
    }
}