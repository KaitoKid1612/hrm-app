-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('COMPANY', 'SMALL_BUSINESS', 'HEADHUNTER');

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "type" "CompanyType" NOT NULL DEFAULT 'COMPANY';
