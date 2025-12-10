import { useState, useEffect } from 'react';
import { companyService, Company } from '../services/companyService';

export const useTopCompanies = (limit: number = 6) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await companyService.getTopCompanies(limit);
        setCompanies(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch companies'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, [limit]);

  return { companies, isLoading, error };
};
