/*
  Warnings:

  - Added the required column `firstname` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "firstname" TEXT NOT NULL,
ADD COLUMN     "lastname" TEXT NOT NULL;
