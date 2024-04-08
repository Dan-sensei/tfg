/*
  Warnings:

  - You are about to drop the column `tutor` on the `TFG` table. All the data in the column will be lost.
  - The `author` column on the `TFG` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `defenseDate` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "TFG" DROP COLUMN "tutor",
DROP COLUMN "author",
ADD COLUMN     "author" TEXT[];

-- DropTable
DROP TABLE "defenseDate";

-- CreateTable
CREATE TABLE "tutor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "collegeId" INTEGER NOT NULL,

    CONSTRAINT "tutor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tfgtutor" (
    "tfgId" INTEGER NOT NULL,
    "tutorId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tfgtutor_pkey" PRIMARY KEY ("tfgId","tutorId")
);

-- AddForeignKey
ALTER TABLE "tutor" ADD CONSTRAINT "tutor_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tfgtutor" ADD CONSTRAINT "tfgtutor_tfgId_fkey" FOREIGN KEY ("tfgId") REFERENCES "TFG"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tfgtutor" ADD CONSTRAINT "tfgtutor_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "tutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
