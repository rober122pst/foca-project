import { calculateEventWeeklyPercent, checkEventToday, getEventsService } from "../services/events.services.js";
import { generateId, verifyUuid } from "../services/generateId.service.js";

import { PrismaClient } from "@prisma/client";
import { mapWeekdaysToNumbers } from "../services/events.services.js";

const prisma = new PrismaClient();

// cria um novo evento ligado ao usuário logado
export async function createEvent(req, res) {
    const userId = req.userId;
    const { title, description, type, deadline, dtstart, dtend, rrule, color, tag } = req.body;

    try {
        // busca o perfil do usuário no banco para vincular a sessão
        const { id: profileId } = await prisma.profile.findUnique({ where: { userId }, select: { id: true } })

        // salva o evento no banco de dados
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

// retorna uma lista de eventos do usuário (com filtros opcionais)
export async function getEvents(req, res) {
    const userId = req.userId;
        
    try {
        // trata o filtro de tipo enviado na URL ?type=EVENT,TASK
        const typeParam = req.query.type;

        let types;

        if (typeof typeParam === 'string') {
            types = typeParam.split(','); // separa o tipo em array para busca multipla ['EVENT', 'TASK']
        }

        // filtro para buscar somente eventos do dia
        const todayParam = req.query.today === 'true';

        const events = await getEventsService(prisma, {
            userId: userId,
            types,
            today: todayParam,
        });

        res.json(events);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro no servidor" });
    }
}

// retorna detalhes de um evento especifico
export async function getEventById(req, res) {
    const userId = req.userId;
    const { eventId } = req.params
    
    try {

        // valida se o Id informado é um Id valido
        if (!verifyUuid(eventId)) {
            return res.status(400).json({ message: "ID inválido." });
        }

        // busca o evento garantindo que pertence ao usuario
        const event = await prisma.event.findFirst({ 
            where: { profile: { userId }, id: eventId },
        });

        if (!event) {
            return res.status(404).json({ message: "Evento não encontrado" });
        }

        return res.json(event);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Erro no servidor" })
    }
}

// atualiza um evento existente do usuario
export async function updateEvent(req, res) {
    const userId = req.userId;
    
    try {
        const { eventId } = req.params;

        if (!verifyUuid(eventId)) {
            return res.status(400).json({ message: "ID inválido." });
        }

        // busca o perfil do usuário no banco para vincular a sessão
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

        // atualiza o evento no banco de dados
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

        // Recalcula taxa de progresso semanal do evento
        const { rate } = calculateEventWeeklyPercent(updateEvent.days, updateEvent.completedDays);
        // verifica se o usuário completou o evento no dia atual
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

// deleta um evento específico do usuário
export async function deleteEvent(req, res) {
        const userId = req.userId;
    
    try {
        const { eventId } = req.params;

        if (!verifyUuid(eventId)) {
            return res.status(400).json({ message: "ID inválido." });
        }

        // busca o perfil do usuário no banco para vincular a sessão
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

        // remove o evento do banco de dados
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