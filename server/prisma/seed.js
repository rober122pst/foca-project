// Comentário em português: seed para achievements usando UUIDv7 gerado no backend

import { PrismaClient } from "@prisma/client";
import { AchievementService } from "../src/services/achievements.service.js";

const prisma = new PrismaClient();

async function main() {
  AchievementService.processEvent({
    profileId: '019adfff-2163-7c4c-86dd-e6d9eb553f74',
    type: 'POMODORO_FINISHED',
    data: {
        timestamp: new Date(),
        amount: 1,
    }
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
