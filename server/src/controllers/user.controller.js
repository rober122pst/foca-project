import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getMe(req, res) {
    if (req.userId) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.userId },
                select: {
                    id: true,
                    name: true,
                    config: {
                        select: {
                            theme: true,
                            language: true,
                        }
                    },
                    profile: {
                        select: {
                            picUrl: true,
                            gamefication: {
                                select: {
                                    level: true,
                                    xp: true,
                                    coins: true,
                                }
                            }
                        }
                    }
                }

            });
            if (!user) {
                return res
                    .status(404)
                    .json({ message: 'Usuário não encontrado' });
            }
            res.json(user);
        } catch (err) {
            console.log(err)
            return res.status(500).json({ message: 'Erro no servidor' });
        }
    } else {
        res.status(401).json({ message: 'Acesso Negado' });
    }
}
