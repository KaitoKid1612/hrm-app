import { useState, useCallback } from 'react';

interface UseTableSelectionOptions<T> {
  data?: T[];
  getItemId: (item: T) => string;
}

export const useTableSelection = <T>({ data, getItemId }: UseTableSelectionOptions<T>) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }, []);

  const toggleAll = useCallback(
    (checked: boolean) => {
      if (checked && data) {
        setSelectedIds(data.map(getItemId));
      } else {
        setSelectedIds([]);
      }
    },
    [data, getItemId],
  );

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const isSelected = useCallback((id: string) => selectedIds.includes(id), [selectedIds]);

  const isAllSelected = useCallback(() => {
    return data ? selectedIds.length === data.length && data.length > 0 : false;
  }, [data, selectedIds]);

  return {
    selectedIds,
    toggleSelection,
    toggleAll,
    clearSelection,
    isSelected,
    isAllSelected,
    selectedCount: selectedIds.length,
  };
};
