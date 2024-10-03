/*
  Warnings:

  - You are about to drop the column `colorId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `varient` on the `Variant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[variant]` on the table `Variant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productId` to the `Variant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variant` to the `Variant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_colorId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_variantId_fkey";

-- DropIndex
DROP INDEX "Variant_varient_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "colorId",
DROP COLUMN "variantId";

-- AlterTable
ALTER TABLE "Variant" DROP COLUMN "varient",
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "variant" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_ColorToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ColorToProduct_AB_unique" ON "_ColorToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_ColorToProduct_B_index" ON "_ColorToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_variant_key" ON "Variant"("variant");

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ColorToProduct" ADD CONSTRAINT "_ColorToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Color"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ColorToProduct" ADD CONSTRAINT "_ColorToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
