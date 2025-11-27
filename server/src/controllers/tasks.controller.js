import { PrismaClient } from "@prisma/client";
import { generateId } from "../services/generateId.service.js";

const prisma = new PrismaClient();

export async function createTask(req, res) {
    const userId = req.userId;
    const { title, description, tags, deadline, priority } = req.body;

    try {

        const { id: profileId } = await prisma.profile.findUnique({ where: { userId }, select: { id: true } })

        const newTask = await prisma.task.create({
            data: {
                id: generateId(),
                profileId,
                title,
                tags: ['Tag 1', 'Tag 2'],
                description,
                deadline,
                priority,
            }
        });

        return res.status(201).json(newTask);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erro ao postar dados' });
    }
}  

export async function updateTask(req, res) {
    const userId = req.userId;
    
    try {
        const { taskId } = req.params;
        
        if (!verifyUuid(taskId)) {
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

        const updateTask = await prisma.task.update({
            where: {
                profileId,
                id: taskId,
            },
            data: req.body,
        });

        if (!updateTask) {
            return res.status(404).json({ message: "Tarefa não encontrada" });
        }
    } catch (error) {
        
    }
}

export async function deleteTask(req, res) {
        const userId = req.userId;
    
    try {
        const { taskId } = req.params;

        if (!verifyUuid(taskId)) {
            return res.status(400).json({ message: "ID inválido." });
        }

        const profile = await prisma.task.findUnique({ 
            where: { userId },
            select: {
                id: true,
            },
        });

        if (!profile) {
            return res.status(404).json({ message: "Perfil não encontrado" });
        }

        const profileId = profile.id;

        const result = await prisma.task.delete({ 
            where: { profileId, id: taskId },
        })

        if (!result) {
            return res.status(404).json({ message: "Tarefa não encontrada" });
        }

        return res.json({ message: 'Tarefa deletada' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erro no servidor" });
    }
}