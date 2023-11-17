/*
  Warnings:

  - Changed the type of `coursePoints` on the `Courses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `faq` on the `Courses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Courses" DROP COLUMN "coursePoints",
ADD COLUMN     "coursePoints" JSONB NOT NULL,
DROP COLUMN "faq",
ADD COLUMN     "faq" JSONB NOT NULL;
