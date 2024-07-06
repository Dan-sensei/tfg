/*
  Warnings:

  - You are about to drop the column `content` on the `tfg` table. All the data in the column will be lost.
  - Added the required column `contentBlocks` to the `tfg` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tfg" DROP COLUMN "content",
ADD COLUMN     "contentBlocks" TEXT NOT NULL;
