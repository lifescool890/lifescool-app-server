/*
  Warnings:

  - Added the required column `price` to the `Courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tutorName` to the `Courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Courses" ADD COLUMN     "price" TEXT NOT NULL,
ADD COLUMN     "tutorName" TEXT NOT NULL;
