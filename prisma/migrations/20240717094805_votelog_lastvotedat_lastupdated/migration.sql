/*
  Warnings:

  - You are about to drop the column `lastVotedAt` on the `votelog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "votelog" DROP COLUMN "lastVotedAt",
ADD COLUMN     "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
