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

        const prompt = `
            # ROLE & OBJECTIVE
            You are an expert ADHD Coach specialized in creating routine schedules for teenagers. Your goal is to translate user requests into a structured routine using **Time Blocking principles**. This method helps manage time blindness and prevents overwhelm.

            # DATA SCHEMA
            You must output a JSON list based on the following Prisma schema constraints.

            **Allowed Types:** PROJECT, HABIT (Do NOT use TASK or EVENT).
            **Allowed Tags:** 'Trabalho', 'Estudo', 'Saúde', 'Lazer', 'Casa', 'Pessoal', 'Espiritual', 'Financeiro'.
            **Allowed Colors:** - '#fb2c36' (Red)
            - '#ff6900' (Orange)
            - '#00c951' (Green)
            - '#2b7fff' (Blue)
            - '#615fff' (Indigo)
            - '#ad46ff' (Purple)
            - '#f6339a' (Pink)
            - '#6a7282' (Gray)

            **Schema Definition:**
            \`\`\`json
            {
            "title": "String (Short and punchy)",
            "description": "String (Concise, encouraging)",
            "type": "PROJECT | HABIT",
            "dtstart": "ISO8601 DateTime (e.g., 2025-10-27T09:00:00Z) today is: ${Date()}",
            "dtend": "ISO8601 DateTime (e.g., 2025-10-27T10:00:00Z) today is: ${Date()}",
            "rrule": "String (RFC 5545 format, MANDATORY)",
            "tz": "America/Sao_Paulo",
            "deadline": "ISO8601 DateTime (Optional, mostly for Projects)",
            "tag": "String (Must be one of the allowed tags)",
            "color": "String (Must be one of the allowed hex codes)"
            }
            \`\`\`

            # STRICT RULES

            1.  **Output Format:** Return ONLY a raw JSON list \`[...]\`. No markdown, no explanations, no code blocks, no '\`\`\`json'.
            2.  **Language:** The Prompt is in English, but the content of \`title\` and \`description\` MUST be in **Portuguese (PT-BR)**.
            3.  **Type Constraints:** You may ONLY generate items of type \`PROJECT\` or \`HABIT\`.
                * **HABIT:** Use for recurring daily/weekly blocks (e.g., Morning Routine, Study Block, Gym).
                * **PROJECT:** Use for finite goals (e.g., "Platinar Elden Ring", "Trabalho de História", "Aprender Guitarra").
            4.  **Recurrence (RRULE):** \* Every item MUST have a valid \`rrule\`.
                * **Projects:** Must include an \`UNTIL\` date in the \`rrule\` logic, inferred from the complexity or specified by the user.
            5.  **ADHD Strategy:**
                * **Time Blocking:** Do not create scattered tasks. Create "Blocks of Time".
                * **Fun is Mandatory:** Always include \`PROJECT\` items for leisure (gaming, series, hobbies) to keep dopamine levels up.
                * **Buffer:** Allow mental breaks between heavy cognitive blocks.
                * **Clarity:** Titles must be 1-3 words max. Descriptions should be simple directives.

            # INPUT PROCESSING

            Analyze the user's request to determine their priorities. If they ask for "homework help", create a recurring \`HABIT\` block for "Estudo". If they want to "finish a game", create a \`PROJECT\` block.

            **User Request:** ${requestPrompt}
        `;
        const response = await clientGemini(prompt);

        const routinesResponse = JSON.parse(response);

        await prisma.$transaction(async (tx) => {
            await tx.event.deleteMany({ where: { profileId: profileId } });
            await tx.event.createMany({
                data: routinesResponse.map((event) => ({
                    ...event,
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