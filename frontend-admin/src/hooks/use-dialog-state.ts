/**
 * Generic Dialog State Hook
 * Manages dialog open/close state with selected item
 * Reduces boilerplate for CRUD dialogs
 */

import { useState, useCallback } from 'react';

export interface UseDialogStateReturn<T> {
  open: boolean;
  selectedItem: T | null;
  openDialog: (item?: T | null) => void;
  closeDialog: () => void;
  openCreate: () => void;
  openEdit: (item: T) => void;
}

/**
 * Hook for managing dialog state (open/close + selected item)
 * Usage:
 * const dialog = useDialogState<Job>();
 * <JobDialog open={dialog.open} onOpenChange={dialog.closeDialog} job={dialog.selectedItem} />
 */
export function useDialogState<T = unknown>(): UseDialogStateReturn<T> {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const openDialog = useCallback((item?: T | null) => {
    setSelectedItem(item ?? null);
    setOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
    // Delay clearing selectedItem to prevent UI flash during close animation
    setTimeout(() => setSelectedItem(null), 300);
  }, []);

  const openCreate = useCallback(() => {
    setSelectedItem(null);
    setOpen(true);
  }, []);

  const openEdit = useCallback((item: T) => {
    setSelectedItem(item);
    setOpen(true);
  }, []);

  return {
    open,
    selectedItem,
    openDialog,
    closeDialog,
    openCreate,
    openEdit,
  };
}

/**
 * Hook for managing confirmation dialog state
 */
export interface UseConfirmDialogReturn {
  open: boolean;
  itemId: string | null;
  openConfirm: (id: string) => void;
  closeConfirm: () => void;
  confirm: (callback: (id: string) => void) => void;
}

export function useConfirmDialog(): UseConfirmDialogReturn {
  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState<string | null>(null);

  const openConfirm = useCallback((id: string) => {
    setItemId(id);
    setOpen(true);
  }, []);

  const closeConfirm = useCallback(() => {
    setOpen(false);
    setTimeout(() => setItemId(null), 300);
  }, []);

  const confirm = useCallback(
    (callback: (id: string) => void) => {
      if (itemId) {
        callback(itemId);
        closeConfirm();
      }
    },
    [itemId, closeConfirm],
  );

  return {
    open,
    itemId,
    openConfirm,
    closeConfirm,
    confirm,
  };
}
