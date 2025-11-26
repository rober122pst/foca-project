import { PrismaClient } from "@prisma/client";
import { clientGemini } from '../services/gemini.service.js';
import { generateId } from "../services/generateId.service.js";

const prisma = new PrismaClient();


export async function geminiCreateRoutine(req, res) {
    const userId = req.userId;
    
    try {

        const { prompt: requestPrompt } = req.body;

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

        const prompt = `Você é um coach de rotinas profissional. Seu trabalho é gerar a rotina mais saudavel para o usuario. Você deve responder EXCLUSIVAMENTE com JSON válido. Sua tarefa é gerar uma lista (array) de objetos seguindo rigorosamente o schema "Routine". Cada objeto deve conter TODAS as propriedades abaixo, com nomes idênticos e formatos imutáveis:

        IMPORTANTE: A resposta deve ser APENAS o JSON, sem markdown, sem blocos de código e sem texto fora do array. Pronto para utilizar com JSON.parse()

        - title: string
        - description: string ou null
        - days: array contendo apenas valores permitidos: ["SUN","MON","TUE","WED","THU","FRI","SAT"]
        - tag: string ['Trabalho', 'Estudo', 'Saúde', 'Lazer', 'Casa', 'Pessoal', 'Espiritual', 'Financeiro']
        - color: string (hexadecimal entre um desses: ["#fb2c36", "#ff6900", "#00c951", "#2b7fff", "#615fff", "#ad46ff", "#f6339a", "#6a7282"])
        - startTime: string (ISO 8601 em UTC, ex: "1970-01-01T08:00:00Z")
        - endTime: string (ISO 8601 em UTC)

        Regras obrigatórias:
        1) A resposta deve ser SOMENTE um JSON contendo um array de objetos – nenhum texto fora dele.
        2) Utilize null em qualquer campo sem valor definido.
        3) Datas devem estar sempre em ISO 8601, incluindo “Z” (UTC). Sempre na data 1970-01-01, o que importa é a hora.
        4) Os nomes das chaves não podem ser modificados de nenhuma forma.
        5) Não inclua comentários, explicações, metadados, prefixos ou sufixos.
        6) A estrutura final deve ser completamente parseável sem erros.
        7) Se o contexto adicional indicar preferências do usuário, integre essas preferências de maneira lógica e consistente dentro dos valores dos objetos, sem alterar o formato.
        8) Cada rotina deve ser coerente internamente: horário de início deve sempre ser anterior ao horário de término.
        9) Caso o contexto sugira rotinas relacionadas a foco, TDAH, produtividade ou gamificação, ajuste automaticamente titles, tags, cores e horários para refletir um design funcional e significativo.
        10) Mesmo sob ambiguidade, você NUNCA deve gerar algo fora da estrutura JSON solicitada.
        11) Não inclua momentos de pausa, apenas atividades devem ser registradas.

        Contexto adicional do usuário: ${requestPrompt}
        `;
        const response = await clientGemini(prompt);

        const routinesResponse = JSON.parse(response);

        await prisma.$transaction(async (tx) => {
            await tx.routine.deleteMany();
            await tx.routine.createMany({
                data: routinesResponse.map((routine) => ({
                    ...routine,
                    id: generateId(),
                    profileId: profileId,
                }))
            })
        });


        // for (const routine of routinesResponse) {
        //     await prisma.routine.create({
        //         data: {
        //             id: generateId(),
        //             profileId: profileId,
        //             title: routine.title,
        //             description: routine.description,
        //             days: routine.days,
        //             tag: routine.tag,
        //             color: routine.color,
        //             startTime: routine.startTime,
        //             endTime: routine.endTime,
        //         }
        //     })
        // }

        return res.json({
            message: 'Rotina criada com sucesso!',
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erro no servidor' })
    }
}