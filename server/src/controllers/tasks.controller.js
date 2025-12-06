import { PrismaClient } from "@prisma/client";
import { generateId } from "../services/generateId.service.js";

const prisma = new PrismaClient();

// cria uma nova tarefa para o usuário autenticado
export async function createTask(req, res) {
    const userId = req.userId;
    const { title, description, tags, deadline, priority } = req.body;

    try {
        // busca o id do perfil associado ao usuário
        const { id: profileId } = await prisma.profile.findUnique({ where: { userId }, select: { id: true } })

        // cria a tarefa no banco de dados
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

// atualiza uma tarefa existente do usuário
export async function updateTask(req, res) {
    const userId = req.userId;
    
    try {
        const { taskId } = req.params;
        
        // valida se o id da tarefa é válido
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

        // atualiza os dados da tarefa no banco
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

// deleta uma tarefa existente do usuário
export async function deleteTask(req, res) {
        const userId = req.userId;
    
    try {
        const { taskId } = req.params;

        // valida se o id da tarefa é válido
        if (!verifyUuid(taskId)) {
            return res.status(400).json({ message: "ID inválido." });
        }

        // busca o perfil para confirmar propriedade da tarefa
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

        // remove a tarefa do banco de dados
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