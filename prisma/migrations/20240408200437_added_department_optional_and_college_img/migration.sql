-- AlterTable
ALTER TABLE "College" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "TFG" ADD COLUMN     "departmentId" INTEGER;

-- CreateTable
CREATE TABLE "department" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TFG" ADD CONSTRAINT "TFG_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
