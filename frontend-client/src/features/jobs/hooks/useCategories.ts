import { useState, useEffect } from 'react';
import { categoryService, Category } from '../services/categoryService';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await categoryService.getCategories();
        setCategories(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
};
