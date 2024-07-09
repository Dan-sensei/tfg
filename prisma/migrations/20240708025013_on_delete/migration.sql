-- DropForeignKey
ALTER TABLE "MessageRead" DROP CONSTRAINT "MessageRead_messageId_fkey";

-- DropForeignKey
ALTER TABLE "MessageRead" DROP CONSTRAINT "MessageRead_userId_fkey";

-- DropForeignKey
ALTER TABLE "ReviewMessage" DROP CONSTRAINT "ReviewMessage_tfgId_fkey";

-- DropForeignKey
ALTER TABLE "ReviewMessage" DROP CONSTRAINT "ReviewMessage_userId_fkey";

-- DropForeignKey
ALTER TABLE "TutorTFG" DROP CONSTRAINT "TutorTFG_tfgId_fkey";

-- DropForeignKey
ALTER TABLE "TutorTFG" DROP CONSTRAINT "TutorTFG_userId_fkey";

-- DropForeignKey
ALTER TABLE "daily_tfg_view" DROP CONSTRAINT "DailyTFGView_tfgId_fkey";

-- DropForeignKey
ALTER TABLE "defense" DROP CONSTRAINT "Defense_collegeId_fkey";

-- DropForeignKey
ALTER TABLE "department" DROP CONSTRAINT "department_collegeId_fkey";

-- DropForeignKey
ALTER TABLE "location" DROP CONSTRAINT "Location_collegeId_fkey";

-- DropForeignKey
ALTER TABLE "titulation" DROP CONSTRAINT "GradeMaster_collegeId_fkey";

-- AlterTable
ALTER TABLE "MessageRead" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ReviewMessage" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ReviewMessage" ADD CONSTRAINT "ReviewMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewMessage" ADD CONSTRAINT "ReviewMessage_tfgId_fkey" FOREIGN KEY ("tfgId") REFERENCES "tfg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageRead" ADD CONSTRAINT "MessageRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageRead" ADD CONSTRAINT "MessageRead_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "ReviewMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "college"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "titulation" ADD CONSTRAINT "GradeMaster_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "college"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorTFG" ADD CONSTRAINT "TutorTFG_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorTFG" ADD CONSTRAINT "TutorTFG_tfgId_fkey" FOREIGN KEY ("tfgId") REFERENCES "tfg"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense" ADD CONSTRAINT "Defense_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "college"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location" ADD CONSTRAINT "Location_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "college"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_tfg_view" ADD CONSTRAINT "DailyTFGView_tfgId_fkey" FOREIGN KEY ("tfgId") REFERENCES "tfg"("id") ON DELETE CASCADE ON UPDATE CASCADE;
