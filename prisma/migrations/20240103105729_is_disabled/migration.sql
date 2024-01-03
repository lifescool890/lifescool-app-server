/*
  Warnings:

  - You are about to drop the column `isDesable` on the `Courses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Courses" DROP COLUMN "isDesable",
ADD COLUMN     "isDisable" BOOLEAN NOT NULL DEFAULT false;
