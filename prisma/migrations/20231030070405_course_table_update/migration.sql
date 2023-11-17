/*
  Warnings:

  - You are about to drop the column `upComingDate` on the `Courses` table. All the data in the column will be lost.
  - Added the required column `upComingEndingDate` to the `Courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `upComingStartingDate` to the `Courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Courses" DROP COLUMN "upComingDate",
ADD COLUMN     "upComingEndingDate" TEXT NOT NULL,
ADD COLUMN     "upComingStartingDate" TEXT NOT NULL;
