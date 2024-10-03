-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "billing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "default" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shipping" BOOLEAN NOT NULL DEFAULT false;
