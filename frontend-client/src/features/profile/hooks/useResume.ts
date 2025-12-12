import { useState, useEffect } from 'react';
import { resumeService } from '../services/resumeService';
import { Resume, ResumeFormData } from '../types/resume';

export const useResume = () => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchResume = async () => {
    try {
      setIsLoading(true);
      const data = await resumeService.getMyResume();
      setResume(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch resume'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const upsertResume = async (data: ResumeFormData) => {
    try {
      const response = await resumeService.upsertResume(data);
      setResume(response);
      return response;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to save resume');
    }
  };

  const uploadResumeFile = async (file: File) => {
    try {
      const response = await resumeService.uploadResumeFile(file);
      await fetchResume(); // Refresh resume after upload
      return response;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to upload resume file');
    }
  };

  return {
    resume,
    isLoading,
    error,
    upsertResume,
    uploadResumeFile,
    refetch: fetchResume,
  };
};
