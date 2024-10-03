/*
  Warnings:

  - You are about to drop the column `attributes` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "attributes",
ADD COLUMN     "connectivity" TEXT,
ADD COLUMN     "features" TEXT,
ADD COLUMN     "lens" TEXT,
ADD COLUMN     "screenType" TEXT,
ADD COLUMN     "sensor" TEXT,
ADD COLUMN     "zoom" TEXT;
