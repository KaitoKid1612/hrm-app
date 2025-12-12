import { useState, useEffect } from 'react';
import { applicationService } from '../services/jobActionsService';

export const useJobApplication = (jobId: string) => {
  const [hasApplied, setHasApplied] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkApplication = async () => {
      try {
        const applied = await applicationService.checkIfApplied(jobId);
        setHasApplied(applied);
      } catch (error) {
        console.error('Error checking application:', error);
      } finally {
        setIsChecking(false);
      }
    };

    if (jobId) {
      checkApplication();
    }
  }, [jobId]);

  const applyJob = async (data: { resumeId?: string; coverLetter?: string }) => {
    await applicationService.applyJob({ jobId, ...data });
    setHasApplied(true);
    return true;
  };

  return {
    hasApplied,
    isChecking,
    applyJob,
  };
};
