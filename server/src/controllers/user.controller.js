import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// retorna os dados do usuário logado
export async function getMe(req, res) {
    // valida se o usuário está autenticado
    if (req.userId) {
        try {
            // busca no banco apenas os dados necessários do usuário
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
                                    totalXp: true,
                                    coins: true,
                                }
                            }
                        }
                    }
                }

            });
            // verifica se o usuário existe
            if (!user) {
                return res
                    .status(404)
                    .json({ message: 'Usuário não encontrado' });
            }
            // retorna os dados do usuário
            res.json(user);
        } catch (err) {
            console.log(err)
            return res.status(500).json({ message: 'Erro no servidor' });
        }
    // resposta para quando o usuário não está autenticado
    } else {
        res.status(401).json({ message: 'Acesso Negado' });
    }
}
