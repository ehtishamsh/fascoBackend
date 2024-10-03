-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "microphone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "noiseCancellation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "wireless" BOOLEAN NOT NULL DEFAULT false;
