import { useState } from 'react';
import {
  candidateSearchService,
  CandidateProfile,
  CandidateSearchFilters,
} from '../services/candidateSearchService';

export const useCandidateSearch = () => {
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  const searchCandidates = async (filters: CandidateSearchFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await candidateSearchService.searchCandidates(filters);
      setCandidates(data.candidates || data);
      setTotalResults(data.total || data.length);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    candidates,
    isLoading,
    error,
    totalResults,
    searchCandidates,
    setCandidates,
  };
};

export const useSavedCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadSavedCandidates = async () => {
    try {
      setIsLoading(true);
      const data = await candidateSearchService.getSavedCandidates();
      setSavedCandidates(data.map((c: { id: string }) => c.id));
    } catch {
      // Ignore errors
    } finally {
      setIsLoading(false);
    }
  };

  const saveCandidate = async (candidateId: string) => {
    await candidateSearchService.saveCandidateToPool(candidateId);
    setSavedCandidates([...savedCandidates, candidateId]);
  };

  const unsaveCandidate = async (candidateId: string) => {
    await candidateSearchService.removeSavedCandidate(candidateId);
    setSavedCandidates(savedCandidates.filter((id) => id !== candidateId));
  };

  const isSaved = (candidateId: string) => savedCandidates.includes(candidateId);

  return {
    savedCandidates,
    isLoading,
    loadSavedCandidates,
    saveCandidate,
    unsaveCandidate,
    isSaved,
  };
};
