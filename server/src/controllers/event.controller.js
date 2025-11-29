import { calculateEventWeeklyPercent, checkEventToday } from "../services/events.services.js";
import { generateId, verifyUuid } from "../services/generateId.service.js";

import { PrismaClient } from "@prisma/client";
import { mapWeekdaysToNumbers } from "../services/events.services.js";

const prisma = new PrismaClient();

export async function createEvent(req, res) {
    const userId = req.userId;
    const { title, description, type, deadline, dtstart, dtend, rrule, color, tag } = req.body;

    try {

        const { id: profileId } = await prisma.profile.findUnique({ where: { userId }, select: { id: true } })

        const newEvent = await prisma.event.create({
            data: {
                id: generateId(),
                profileId,
                title,
                type,
                description,
                dtstart,
                dtend,
                deadline,
                rrule,
                tag,
                color,
            }
        });

        return res.status(201).json(newEvent);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro ao postar dados' });
    }
}  

export async function getEvents(req, res) {
    const userId = req.userId;
    
    try {
        const { events } = await prisma.profile.findUnique({ 
            where: { userId },
            select: {
                events: true,
            },
        });

        return res.json(events);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro no servidor" });
    }
}

export async function getEventById(req, res) {
    const userId = req.userId;
    
    try {
        const { eventId } = req.params

        if (!verifyUuid(eventId)) {
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

        const event = await prisma.event.findUnique({
            where: {
                profileId,
                id: eventId,
            },
        });

        if (!event) {
            return res.status(404).json({ message: "Rotina não encontrada" });
        }

        const { rate } = calculateEventWeeklyPercent(event.days, event.completedDays)
        const { didToday: completed } = checkEventToday(event.days, event.completedDays)

        return res.json({
            ...event,
            days: mapWeekdaysToNumbers(event.days),
            rate: rate || 0,
            completed,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Erro no servidor" })
    }
}

export async function updateEvent(req, res) {
    const userId = req.userId;
    
    try {
        const { eventId } = req.params;

        if (!verifyUuid(eventId)) {
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

        const updateEvent = await prisma.event.update({
            where: {
                profileId,
                id: eventId,
            },
            data: req.body,
        });

        if (!updateEvent) {
            return res.status(404).json({ message: "Rotina não encontrada" });
        }

        const { rate } = calculateEventWeeklyPercent(updateEvent.days, updateEvent.completedDays);
        const { didToday: completed } = checkEventToday(updateEvent.days, updateEvent.completedDays);

        return res.json({
            ...updateEvent,
            days: mapWeekdaysToNumbers(updateEvent.days),
            rate: rate || 0,
            completed,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro no servidor" });
    }
}

export async function deleteEvent(req, res) {
        const userId = req.userId;
    
    try {
        const { eventId } = req.params;

        if (!verifyUuid(eventId)) {
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

        const result = await prisma.event.delete({ 
            where: { profileId, id: eventId },
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