/*
  Warnings:

  - You are about to drop the column `trending1` on the `Trending` table. All the data in the column will be lost.
  - You are about to drop the column `trending2` on the `Trending` table. All the data in the column will be lost.
  - You are about to drop the column `trending3` on the `Trending` table. All the data in the column will be lost.
  - You are about to drop the column `trending4` on the `Trending` table. All the data in the column will be lost.
  - You are about to drop the column `trending5` on the `Trending` table. All the data in the column will be lost.
  - You are about to drop the column `trending6` on the `Trending` table. All the data in the column will be lost.
  - Added the required column `trending` to the `Trending` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trending" DROP COLUMN "trending1",
DROP COLUMN "trending2",
DROP COLUMN "trending3",
DROP COLUMN "trending4",
DROP COLUMN "trending5",
DROP COLUMN "trending6",
ADD COLUMN     "trending" JSONB NOT NULL;
