/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,collegeId]` on the table `department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,collegeId]` on the table `location` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,collegeId]` on the table `titulation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "department_name_collegeId_key" ON "department"("name", "collegeId");

-- CreateIndex
CREATE UNIQUE INDEX "location_name_collegeId_key" ON "location"("name", "collegeId");

-- CreateIndex
CREATE UNIQUE INDEX "titulation_name_collegeId_key" ON "titulation"("name", "collegeId");
