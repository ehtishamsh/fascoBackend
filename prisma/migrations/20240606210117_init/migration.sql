/*
  Warnings:

  - You are about to drop the column `size` on the `Variant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[varient]` on the table `Variant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ram` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Variant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `varient` to the `Variant` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Variant_size_key";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "ram" TEXT NOT NULL,
ALTER COLUMN "screenSize" SET DATA TYPE TEXT,
ALTER COLUMN "cores" SET DATA TYPE TEXT,
ALTER COLUMN "mainCamera" SET DATA TYPE TEXT,
ALTER COLUMN "frontCamera" SET DATA TYPE TEXT,
ALTER COLUMN "battery" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Variant" DROP COLUMN "size",
ADD COLUMN     "price" TEXT NOT NULL,
ADD COLUMN     "varient" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Variant_varient_key" ON "Variant"("varient");
