/*
  Warnings:

  - You are about to drop the `_TFGTutor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tutor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TFGTutor" DROP CONSTRAINT "_TFGTutor_A_fkey";

-- DropForeignKey
ALTER TABLE "_TFGTutor" DROP CONSTRAINT "_TFGTutor_B_fkey";

-- DropForeignKey
ALTER TABLE "tutor" DROP CONSTRAINT "tutor_collegeId_fkey";

-- AlterTable
ALTER TABLE "tfg" ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "_TFGTutor";

-- DropTable
DROP TABLE "tutor";

-- CreateTable
CREATE TABLE "ReviewMessage" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "tfgId" INTEGER NOT NULL,

    CONSTRAINT "ReviewMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "email" TEXT NOT NULL,
    "role" INTEGER NOT NULL,
    "contactDetails" TEXT,
    "collegeId" INTEGER NOT NULL,
    "tfgId" INTEGER NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTFG" (
    "userId" INTEGER NOT NULL,
    "tfgId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "UserTFG_pkey" PRIMARY KEY ("userId","tfgId")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "ReviewMessage" ADD CONSTRAINT "ReviewMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewMessage" ADD CONSTRAINT "ReviewMessage_tfgId_fkey" FOREIGN KEY ("tfgId") REFERENCES "tfg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "college"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTFG" ADD CONSTRAINT "UserTFG_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTFG" ADD CONSTRAINT "UserTFG_tfgId_fkey" FOREIGN KEY ("tfgId") REFERENCES "tfg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
