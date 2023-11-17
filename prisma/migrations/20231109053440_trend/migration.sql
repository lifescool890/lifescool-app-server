/*
  Warnings:

  - Changed the type of `trending1` on the `Trending` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `trending2` on the `Trending` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `trending3` on the `Trending` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `trending4` on the `Trending` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `trending5` on the `Trending` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `trending6` on the `Trending` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Trending" DROP COLUMN "trending1",
ADD COLUMN     "trending1" INTEGER NOT NULL,
DROP COLUMN "trending2",
ADD COLUMN     "trending2" INTEGER NOT NULL,
DROP COLUMN "trending3",
ADD COLUMN     "trending3" INTEGER NOT NULL,
DROP COLUMN "trending4",
ADD COLUMN     "trending4" INTEGER NOT NULL,
DROP COLUMN "trending5",
ADD COLUMN     "trending5" INTEGER NOT NULL,
DROP COLUMN "trending6",
ADD COLUMN     "trending6" INTEGER NOT NULL;
