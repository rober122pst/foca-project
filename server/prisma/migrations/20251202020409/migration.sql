-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('FOCUS', 'BREAK');

-- AlterTable
ALTER TABLE "PomodoroBlock" ADD COLUMN     "type" "BlockType" NOT NULL DEFAULT 'FOCUS';
