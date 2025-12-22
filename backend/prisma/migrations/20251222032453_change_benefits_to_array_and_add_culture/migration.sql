/*
  Warnings:

  - The `benefits` column on the `companies` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "culture" TEXT,
DROP COLUMN "benefits",
ADD COLUMN     "benefits" TEXT[];
