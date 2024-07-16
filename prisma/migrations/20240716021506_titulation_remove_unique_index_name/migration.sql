-- AlterTable
ALTER TABLE "titulation" RENAME CONSTRAINT "GradeMaster_pkey" TO "titulation_pkey";

-- RenameForeignKey
ALTER TABLE "titulation" RENAME CONSTRAINT "GradeMaster_collegeId_fkey" TO "titulation_collegeId_fkey";
