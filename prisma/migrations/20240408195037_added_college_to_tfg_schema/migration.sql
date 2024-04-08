/*
  Warnings:

  - Added the required column `collegeId` to the `TFG` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TFG" ADD COLUMN     "collegeId" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "TFG" ADD CONSTRAINT "TFG_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "TFG" ALTER COLUMN "collegeId" DROP DEFAULT;