/*
  Warnings:

  - You are about to drop the column `microphone` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `noiseCancellation` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `wireless` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "microphone",
DROP COLUMN "noiseCancellation",
DROP COLUMN "wireless";
