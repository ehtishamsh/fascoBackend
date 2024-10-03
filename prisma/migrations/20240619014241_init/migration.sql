-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_variantId_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "variantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
