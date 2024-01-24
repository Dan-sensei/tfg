-- AlterTable
ALTER TABLE "TFG" ADD COLUMN     "scoredTimes" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "defenseDate" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "ubication" TEXT NOT NULL,

    CONSTRAINT "defenseDate_pkey" PRIMARY KEY ("id")
);
