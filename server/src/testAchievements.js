// Comentários em português

import { PrismaClient } from "@prisma/client";
import { generateId } from "./services/generateId.service.js";

const prisma = new PrismaClient();

async function run() {
  const profileId = "019a9985-8373-7c6b-9a73-3617d608556c";
  const achiviementId = "019a9e74-c82d-73d4-b651-6c6746131307";

  const ua = await prisma.userAchiviement.upsert({
    where: {
      // Garante que só exista 1 entry por user + achievement
      profileId_achiviementId: {
          profileId,
          achiviementId,
      }
    },
    update: {
        progress: { increment: 5 }, // adiciona +5
      // achievedAt: new Date(), // se quiser marcar como concluído
    },
    create: {
        id: generateId(),
      profileId,
      achiviementId,
      progress: 5,
    },
  });

  console.log("Progresso atualizado:", ua);
}

run();
