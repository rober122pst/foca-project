import { PrismaClient } from "@prisma/client";
import { AchievementService } from "../src/services/achievements.service.js";

const prisma = new PrismaClient();

// função principal executada quando o script inicia
async function main() {

  // dispara o processamento de conquistas
  AchievementService.processEvent({
    profileId: '019adfff-2163-7c4c-86dd-e6d9eb553f74',
    type: 'POMODORO_FINISHED',
    data: {
        timestamp: new Date(),
        amount: 1,
    }
  })
}
// executa a função principal e trata possíveis erros
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
