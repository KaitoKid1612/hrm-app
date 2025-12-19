'use client';

import { X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onDelete: () => void;
}

export function BulkActionsBar({ selectedCount, onClearSelection, onDelete }: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-primary text-primary-foreground rounded-lg shadow-lg px-4 py-3 flex items-center gap-4">
        <span className="font-medium">{selectedCount} selected</span>
        <div className="h-4 w-px bg-primary-foreground/20" />
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={onDelete} className="h-8">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClearSelection}
            className="h-8 hover:bg-primary-foreground/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
