/*
  Warnings:

  - You are about to drop the `DayTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EverydayTask` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('TODAY', 'EVERYDAY');

-- DropForeignKey
ALTER TABLE "DayTask" DROP CONSTRAINT "DayTask_userId_fkey";

-- DropForeignKey
ALTER TABLE "EverydayTask" DROP CONSTRAINT "EverydayTask_userId_fkey";

-- DropTable
DROP TABLE "DayTask";

-- DropTable
DROP TABLE "EverydayTask";

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,
    "taskType" "TaskType" NOT NULL DEFAULT 'TODAY',

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
