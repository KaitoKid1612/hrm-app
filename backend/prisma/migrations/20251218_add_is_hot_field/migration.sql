-- AlterTable
ALTER TABLE "jobs" ADD COLUMN "isHot" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "jobs_isHot_idx" ON "jobs"("isHot");
