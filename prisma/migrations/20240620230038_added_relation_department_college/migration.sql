-- AlterTable
ALTER TABLE "department" ADD COLUMN     "collegeId" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "college"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
