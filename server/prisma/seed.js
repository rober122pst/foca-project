// Comentário em português: seed para achievements usando UUIDv7 gerado no backend

import { PrismaClient } from "@prisma/client";
import { AchievementService } from "../src/services/achievements.service.js";

const prisma = new PrismaClient();

async function main() {
  // const file = fs.readFileSync("./prisma/seed/achievements.csv", "utf8");

  // const rows = parse(file, {
  //   columns: true,
  //   skip_empty_lines: true,
  // });

  // for (const row of rows) {
  //   await prisma.achiviement.create({
  //     data: {
  //       id: generateId(),
  //       name: row.name,
  //       description: row.description,
  //       iconUrl: row.iconUrl,
  //       total: Number(row.total),
  //       rarity: row.rarity,
  //       xpReward: Number(row.xpReward),
  //       coinReward: Number(row.coinReward),
  //       criteria: row.criteria,
  //     },
  //   });
  // }
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
