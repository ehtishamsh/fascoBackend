/*
  Warnings:

  - You are about to drop the `_ColorToProduct` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productId` to the `Color` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ColorToProduct" DROP CONSTRAINT "_ColorToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_ColorToProduct" DROP CONSTRAINT "_ColorToProduct_B_fkey";

-- AlterTable
ALTER TABLE "Color" ADD COLUMN     "productId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ColorToProduct";

-- AddForeignKey
ALTER TABLE "Color" ADD CONSTRAINT "Color_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
