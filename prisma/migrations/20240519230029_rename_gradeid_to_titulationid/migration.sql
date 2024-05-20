/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `College` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DailyTFGView` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Defense` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GradeMaster` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TFG` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VoteLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DailyTFGView" DROP CONSTRAINT "DailyTFGView_tfgId_fkey";

-- DropForeignKey
ALTER TABLE "Defense" DROP CONSTRAINT "Defense_collegeId_fkey";

-- DropForeignKey
ALTER TABLE "Defense" DROP CONSTRAINT "Defense_locationId_fkey";

-- DropForeignKey
ALTER TABLE "Defense" DROP CONSTRAINT "Defense_tfgId_fkey";

-- DropForeignKey
ALTER TABLE "GradeMaster" DROP CONSTRAINT "GradeMaster_collegeId_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_collegeId_fkey";

-- DropForeignKey
ALTER TABLE "TFG" DROP CONSTRAINT "TFG_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "TFG" DROP CONSTRAINT "TFG_collegeId_fkey";

-- DropForeignKey
ALTER TABLE "TFG" DROP CONSTRAINT "TFG_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "TFG" DROP CONSTRAINT "TFG_gradeId_fkey";

-- DropForeignKey
ALTER TABLE "VoteLog" DROP CONSTRAINT "VoteLog_tfgId_fkey";

-- DropForeignKey
ALTER TABLE "_TFGTotutor" DROP CONSTRAINT "_TFGTotutor_A_fkey";

-- DropForeignKey
ALTER TABLE "tutor" DROP CONSTRAINT "tutor_collegeId_fkey";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "College";

-- DropTable
DROP TABLE "DailyTFGView";

-- DropTable
DROP TABLE "Defense";

-- DropTable
DROP TABLE "GradeMaster";

-- DropTable
DROP TABLE "Location";

-- DropTable
DROP TABLE "TFG";

-- DropTable
DROP TABLE "VoteLog";

-- CreateTable
CREATE TABLE "tfg" (
    "id" SERIAL NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "banner" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "pages" INTEGER NOT NULL,
    "documentLink" TEXT NOT NULL,
    "tags" TEXT[],
    "views" INTEGER NOT NULL DEFAULT 0,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "categoryId" INTEGER NOT NULL,
    "titulationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL DEFAULT '',
    "scoredTimes" INTEGER NOT NULL DEFAULT 0,
    "author" TEXT[],
    "collegeId" INTEGER NOT NULL,
    "departmentId" INTEGER,

    CONSTRAINT "TFG_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "titulation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "collegeId" INTEGER NOT NULL,

    CONSTRAINT "GradeMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "college" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image" TEXT,

    CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votelog" (
    "id" SERIAL NOT NULL,
    "tfgId" INTEGER NOT NULL,
    "ip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VoteLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "defense" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,
    "tfgId" INTEGER,
    "collegeId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Defense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mapLink" TEXT NOT NULL,
    "collegeId" INTEGER NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_tfg_view" (
    "id" SERIAL NOT NULL,
    "tfgId" INTEGER NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyTFGView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Defense_tfgId_key" ON "defense"("tfgId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyTFGView_tfgId_date_key" ON "daily_tfg_view"("tfgId", "date");

-- AddForeignKey
ALTER TABLE "tfg" ADD CONSTRAINT "TFG_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tfg" ADD CONSTRAINT "TFG_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "college"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tfg" ADD CONSTRAINT "TFG_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tfg" ADD CONSTRAINT "TFG_gradeId_fkey" FOREIGN KEY ("titulationId") REFERENCES "titulation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor" ADD CONSTRAINT "tutor_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "college"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "titulation" ADD CONSTRAINT "GradeMaster_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "college"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votelog" ADD CONSTRAINT "VoteLog_tfgId_fkey" FOREIGN KEY ("tfgId") REFERENCES "tfg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense" ADD CONSTRAINT "Defense_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "college"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense" ADD CONSTRAINT "Defense_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "defense" ADD CONSTRAINT "Defense_tfgId_fkey" FOREIGN KEY ("tfgId") REFERENCES "tfg"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location" ADD CONSTRAINT "Location_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "college"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_tfg_view" ADD CONSTRAINT "DailyTFGView_tfgId_fkey" FOREIGN KEY ("tfgId") REFERENCES "tfg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TFGTotutor" ADD CONSTRAINT "_TFGTotutor_A_fkey" FOREIGN KEY ("A") REFERENCES "tfg"("id") ON DELETE CASCADE ON UPDATE CASCADE;
