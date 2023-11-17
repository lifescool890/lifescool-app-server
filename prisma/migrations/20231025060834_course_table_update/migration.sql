/*
  Warnings:

  - Added the required column `courseDesc` to the `Courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseOverView` to the `Courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `promoLink` to the `Courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tutorDesc` to the `Courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `upComingDate` to the `Courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Courses" ADD COLUMN     "courseDesc" TEXT NOT NULL,
ADD COLUMN     "courseOverView" TEXT NOT NULL,
ADD COLUMN     "coursePoints" JSONB[],
ADD COLUMN     "faq" JSONB[],
ADD COLUMN     "promoLink" TEXT NOT NULL,
ADD COLUMN     "tutorDesc" TEXT NOT NULL,
ADD COLUMN     "upComingDate" TIMESTAMP(3) NOT NULL;
