-- AlterTable
ALTER TABLE "department" ALTER COLUMN "collegeId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "tfg" ADD COLUMN     "trendingScore" DOUBLE PRECISION NOT NULL DEFAULT 0;
