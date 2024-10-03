/*
  Warnings:

  - The values [PAYED] on the enum `Payment` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Payment_new" AS ENUM ('PENDING', 'PAID');
ALTER TABLE "Order" ALTER COLUMN "paymentStatus" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "paymentStatus" TYPE "Payment_new" USING ("paymentStatus"::text::"Payment_new");
ALTER TYPE "Payment" RENAME TO "Payment_old";
ALTER TYPE "Payment_new" RENAME TO "Payment";
DROP TYPE "Payment_old";
ALTER TABLE "Order" ALTER COLUMN "paymentStatus" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "currency" SET DEFAULT 'usd';
