/*
  Warnings:

  - You are about to drop the column `contactDetails` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "contactDetails",
ADD COLUMN     "personalPage" TEXT,
ADD COLUMN     "socials" TEXT;
