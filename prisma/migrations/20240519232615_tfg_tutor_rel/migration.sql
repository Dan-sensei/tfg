/*
  Warnings:

  - You are about to drop the `_TFGTotutor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TFGTotutor" DROP CONSTRAINT "_TFGTotutor_A_fkey";

-- DropForeignKey
ALTER TABLE "_TFGTotutor" DROP CONSTRAINT "_TFGTotutor_B_fkey";

-- DropTable
DROP TABLE "_TFGTotutor";

-- CreateTable
CREATE TABLE "_TFGTutor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TFGTutor_AB_unique" ON "_TFGTutor"("A", "B");

-- CreateIndex
CREATE INDEX "_TFGTutor_B_index" ON "_TFGTutor"("B");

-- AddForeignKey
ALTER TABLE "_TFGTutor" ADD CONSTRAINT "_TFGTutor_A_fkey" FOREIGN KEY ("A") REFERENCES "tfg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TFGTutor" ADD CONSTRAINT "_TFGTutor_B_fkey" FOREIGN KEY ("B") REFERENCES "tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
