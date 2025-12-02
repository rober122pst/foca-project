/*
  Warnings:

  - The values [ABORTED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `cicle` on the `PomodoroSession` table. All the data in the column will be lost.
  - You are about to drop the column `endedAt` on the `PomodoroSession` table. All the data in the column will be lost.
  - You are about to drop the column `lastClientPing` on the `PomodoroSession` table. All the data in the column will be lost.
  - You are about to drop the column `pausedCount` on the `PomodoroSession` table. All the data in the column will be lost.
  - You are about to drop the column `plannedDuration` on the `PomodoroSession` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `PomodoroSession` table. All the data in the column will be lost.
  - Added the required column `totalCycles` to the `PomodoroSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPlannedTime` to the `PomodoroSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('WAITING', 'RUNNING', 'PAUSED', 'BREAK', 'COMPLETED', 'CANCELLED', 'ABANDONED');
ALTER TABLE "public"."PomodoroSession" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "PomodoroSession" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "public"."Status_old";
ALTER TABLE "PomodoroSession" ALTER COLUMN "status" SET DEFAULT 'RUNNING';
COMMIT;

-- AlterTable
ALTER TABLE "PomodoroSession" DROP COLUMN "cicle",
DROP COLUMN "endedAt",
DROP COLUMN "lastClientPing",
DROP COLUMN "pausedCount",
DROP COLUMN "plannedDuration",
DROP COLUMN "startedAt",
ADD COLUMN     "currentCicle" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalCycles" INTEGER NOT NULL,
ADD COLUMN     "totalPlannedTime" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'RUNNING';

-- CreateTable
CREATE TABLE "PomodoroBlock" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "sequenceOrder" INTEGER NOT NULL,
    "plannedDuration" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "totalPauseTime" INTEGER NOT NULL DEFAULT 0,
    "lastPauseTime" TIMESTAMP(3),
    "lastPingTime" TIMESTAMP(3),

    CONSTRAINT "PomodoroBlock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PomodoroBlock" ADD CONSTRAINT "PomodoroBlock_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PomodoroSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
