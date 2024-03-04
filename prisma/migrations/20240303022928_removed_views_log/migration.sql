/*
  Warnings:

  - You are about to drop the `ViewLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ViewLog" DROP CONSTRAINT "ViewLog_tfgId_fkey";

-- DropTable
DROP TABLE "ViewLog";
