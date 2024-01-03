/*
  Warnings:

  - You are about to drop the column `isDisable` on the `Courses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Courses" DROP COLUMN "isDisable",
ADD COLUMN     "Disable" BOOLEAN NOT NULL DEFAULT false;
