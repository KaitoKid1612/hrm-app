import { useState, useEffect } from 'react';
import { savedJobsService } from '../services/jobActionsService';

export const useSavedJob = (jobId: string) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const saved = await savedJobsService.checkIfSaved(jobId);
        setIsSaved(saved);
      } catch (error) {
        console.error('Error checking saved status:', error);
      } finally {
        setIsChecking(false);
      }
    };

    if (jobId) {
      checkSavedStatus();
    }
  }, [jobId]);

  const toggleSave = async () => {
    if (isSaved) {
      // Find the saved job ID and unsave
      const savedJobs = await savedJobsService.getMySavedJobs();
      const savedJob = savedJobs.find((job: { jobId: string }) => job.jobId === jobId);
      if (savedJob) {
        await savedJobsService.unsaveJob(savedJob.id);
        setIsSaved(false);
      }
    } else {
      await savedJobsService.saveJob(jobId);
      setIsSaved(true);
    }
    return true;
  };

  return {
    isSaved,
    isChecking,
    toggleSave,
  };
};
