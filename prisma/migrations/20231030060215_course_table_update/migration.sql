/*
  Warnings:

  - You are about to drop the column `upComingEndingDate` on the `Courses` table. All the data in the column will be lost.
  - You are about to drop the column `upComingStartingDate` on the `Courses` table. All the data in the column will be lost.
  - Added the required column `upComingDate` to the `Courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Courses" DROP COLUMN "upComingEndingDate",
DROP COLUMN "upComingStartingDate",
ADD COLUMN     "upComingDate" TIMESTAMP(3) NOT NULL;
