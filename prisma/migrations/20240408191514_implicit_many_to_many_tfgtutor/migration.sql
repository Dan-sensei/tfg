/*
  Warnings:

  - You are about to drop the `tfgtutor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tfgtutor" DROP CONSTRAINT "tfgtutor_tfgId_fkey";

-- DropForeignKey
ALTER TABLE "tfgtutor" DROP CONSTRAINT "tfgtutor_tutorId_fkey";

-- AlterTable
ALTER TABLE "tutor" ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "link" DROP NOT NULL;

-- DropTable
DROP TABLE "tfgtutor";

-- CreateTable
CREATE TABLE "_TFGTotutor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TFGTotutor_AB_unique" ON "_TFGTotutor"("A", "B");

-- CreateIndex
CREATE INDEX "_TFGTotutor_B_index" ON "_TFGTotutor"("B");

-- AddForeignKey
ALTER TABLE "_TFGTotutor" ADD CONSTRAINT "_TFGTotutor_A_fkey" FOREIGN KEY ("A") REFERENCES "TFG"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TFGTotutor" ADD CONSTRAINT "_TFGTotutor_B_fkey" FOREIGN KEY ("B") REFERENCES "tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
