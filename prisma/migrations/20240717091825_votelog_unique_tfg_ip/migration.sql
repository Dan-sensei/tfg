/*
  Warnings:

  - A unique constraint covering the columns `[tfgId,ip]` on the table `votelog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "votelog_tfgId_ip_key" ON "votelog"("tfgId", "ip");
