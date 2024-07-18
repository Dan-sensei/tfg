-- DropForeignKey
ALTER TABLE "votelog" DROP CONSTRAINT "VoteLog_tfgId_fkey";

-- AddForeignKey
ALTER TABLE "votelog" ADD CONSTRAINT "VoteLog_tfgId_fkey" FOREIGN KEY ("tfgId") REFERENCES "tfg"("id") ON DELETE CASCADE ON UPDATE CASCADE;
