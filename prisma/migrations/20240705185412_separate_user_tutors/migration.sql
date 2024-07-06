/*
  Warnings:

  - You are about to drop the column `author` on the `tfg` table. All the data in the column will be lost.
  - You are about to drop the `UserTFG` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserTFG" DROP CONSTRAINT "UserTFG_tfgId_fkey";

-- DropForeignKey
ALTER TABLE "UserTFG" DROP CONSTRAINT "UserTFG_userId_fkey";

-- AlterTable
ALTER TABLE "category" ADD COLUMN     "icon" TEXT;

-- AlterTable
ALTER TABLE "tfg" DROP COLUMN "author";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "personalProjectId" INTEGER;

-- DropTable
DROP TABLE "UserTFG";

-- CreateTable
CREATE TABLE "TutorTFG" (
    "userId" INTEGER NOT NULL,
    "tfgId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" INTEGER NOT NULL,

    CONSTRAINT "TutorTFG_pkey" PRIMARY KEY ("userId","tfgId")
);

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_personalProjectId_fkey" FOREIGN KEY ("personalProjectId") REFERENCES "tfg"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorTFG" ADD CONSTRAINT "TutorTFG_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorTFG" ADD CONSTRAINT "TutorTFG_tfgId_fkey" FOREIGN KEY ("tfgId") REFERENCES "tfg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
