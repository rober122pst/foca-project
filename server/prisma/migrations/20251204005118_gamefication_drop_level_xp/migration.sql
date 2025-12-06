/*
  Warnings:

  - You are about to drop the column `level` on the `Gamefication` table. All the data in the column will be lost.
  - You are about to drop the column `xp` on the `Gamefication` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Gamefication" DROP COLUMN "level",
DROP COLUMN "xp";
