/*
  Warnings:

  - Added the required column `collegeId` to the `Defense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Defense" ADD COLUMN     "collegeId" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Defense" ALTER COLUMN "collegeId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Defense" ADD CONSTRAINT "Defense_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
