// Comentário em português: seed para achievements usando UUIDv7 gerado no backend

import { PrismaClient } from "@prisma/client";
import { parse } from "csv-parse/sync";
import fs from "fs";
import { generateId } from '../src/services/generateId.service.js';

const prisma = new PrismaClient();

async function main() {
  const file = fs.readFileSync("./seed/achievements.csv", "utf8");

  const rows = parse(file, {
    columns: true,
    skip_empty_lines: true,
  });

  for (const row of rows) {
    await prisma.achiviement.create({
      data: {
        id: generateId(),
        name: row.name,
        description: row.description,
        iconUrl: row.iconUrl,
        total: Number(row.total),
        rarity: row.rarity,
        xpReward: Number(row.xpReward),
        coinReward: Number(row.coinReward),
        criteria: row.criteria,
      },
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
