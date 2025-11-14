import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getOverview (req, res) {
    try {
        // const userGame = await prisma.gamefication.findUnique({
        //     where: { userId: req.userId }
        // });

        res.json({
            statsBar: {
                streakCurrent: 7,
                focusTime: 78, // TODO: fazer logica para somar tempo de foco
                completedTask: 3, // TODO: fazer logica para somar tarefas concluidas
                activeRoutines: 7, // TODO: fazer logica para somar rotinas ativas               
            },
            dailyTask: [ // TODO: tabela de tasks
                {title: "trabalho de matematica", isCompleted: false},
                {title: "jogar dominó", isCompleted: false},
                {title: "beber agua", isCompleted: false},
                {title: "pagar agiota", isCompleted: true},
            ]
        });
    } catch (error) {
        return res.status(500).json({ message: 'Erro no servidor' });
    }
}