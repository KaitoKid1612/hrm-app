-- CreateTable
CREATE TABLE "job_invites" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "note" TEXT,
    "sentBy" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "job_invites_jobId_idx" ON "job_invites"("jobId");

-- CreateIndex
CREATE INDEX "job_invites_email_idx" ON "job_invites"("email");

-- AddForeignKey
ALTER TABLE "job_invites" ADD CONSTRAINT "job_invites_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
