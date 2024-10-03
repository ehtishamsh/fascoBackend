/*
  Warnings:

  - You are about to drop the column `cancel` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `cod` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `orderConfirmation` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shipping` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `toDeliver` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Order` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentType` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'SHIPPED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Payment" AS ENUM ('PENDING', 'PAYED');

-- CreateEnum
CREATE TYPE "PaymentMethoad" AS ENUM ('COD', 'CARD');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "cancel",
DROP COLUMN "cod",
DROP COLUMN "orderConfirmation",
DROP COLUMN "shipping",
DROP COLUMN "toDeliver",
DROP COLUMN "total",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USA',
ADD COLUMN     "orderStatus" "OrderStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "paymentIntentId" TEXT,
ADD COLUMN     "paymentStatus" "Payment" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "paymentType" "PaymentMethoad" NOT NULL,
ALTER COLUMN "status" SET DEFAULT ARRAY['Order is in processing']::TEXT[];
