/*
  Warnings:

  - Changed the type of `verifycodeExpiry` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "verifycodeExpiry",
ADD COLUMN     "verifycodeExpiry" TIMESTAMP(3) NOT NULL;
