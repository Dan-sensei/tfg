/*
  Warnings:

  - Added the required column `score` to the `votelog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "votelog" ADD COLUMN     "score" INTEGER NOT NULL;
