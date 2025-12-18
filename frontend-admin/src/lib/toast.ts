import { toast as sonnerToast } from 'sonner';
import { logger } from './logger';

/**
 * Toast notification utilities
 * Wrapper around Sonner with logging integration
 */

interface ToastOptions {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

class Toast {
  /**
   * Show success toast
   */
  success(message: string, options?: ToastOptions): string | number {
    logger.info('Toast: Success', { message, options });

    return sonnerToast.success(message, {
      description: options?.description,
      duration: options?.duration,
      action: options?.action,
    });
  }

  /**
   * Show error toast
   */
  error(message: string, error?: Error, options?: ToastOptions): string | number {
    logger.error('Toast: Error', error, { message, options });

    return sonnerToast.error(message, {
      description: options?.description || error?.message,
      duration: options?.duration || 5000, // Longer duration for errors
      action: options?.action,
    });
  }

  /**
   * Show warning toast
   */
  warning(message: string, options?: ToastOptions): string | number {
    logger.warn('Toast: Warning', { message, options });

    return sonnerToast.warning(message, {
      description: options?.description,
      duration: options?.duration,
      action: options?.action,
    });
  }

  /**
   * Show info toast
   */
  info(message: string, options?: ToastOptions): string | number {
    logger.info('Toast: Info', { message, options });

    return sonnerToast.info(message, {
      description: options?.description,
      duration: options?.duration,
      action: options?.action,
    });
  }

  /**
   * Show loading toast
   */
  loading(message: string, options?: Omit<ToastOptions, 'action'>): string | number {
    logger.debug('Toast: Loading', { message, options });

    return sonnerToast.loading(message, {
      description: options?.description,
      duration: options?.duration,
    });
  }

  /**
   * Show promise toast (automatically handles loading, success, error states)
   */
  promise<T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: Error) => string);
    },
  ): Promise<T> {
    logger.debug('Toast: Promise started', { loading });

    const toastPromise = sonnerToast.promise(promise, {
      loading,
      success: (data: T) => {
        const message = typeof success === 'function' ? success(data) : success;
        logger.info('Toast: Promise success', { message });
        return message;
      },
      error: (err: Error) => {
        const message = typeof error === 'function' ? error(err) : error;
        logger.error('Toast: Promise error', err, { message });
        return message;
      },
    });

    return promise;
  }

  /**
   * Dismiss a specific toast
   */
  dismiss(toastId?: string | number): void {
    sonnerToast.dismiss(toastId);
  }

  /**
   * Custom toast with more control
   */
  custom(message: string, options?: ToastOptions & { icon?: React.ReactNode }): string | number {
    return sonnerToast(message, {
      description: options?.description,
      duration: options?.duration,
      action: options?.action,
      icon: options?.icon,
    });
  }

  /**
   * API error handler - shows user-friendly error messages
   */
  apiError(error: unknown, fallbackMessage = 'An error occurred'): string | number {
    let message = fallbackMessage;
    let description: string | undefined;

    if (error instanceof Error) {
      message = error.message || fallbackMessage;
      description = error.cause ? String(error.cause) : undefined;
    } else if (typeof error === 'object' && error !== null) {
      const err = error as { message?: string; error?: string; statusText?: string };
      message = err.message || err.error || err.statusText || fallbackMessage;
    }

    return this.error(message, error instanceof Error ? error : undefined, {
      description,
    });
  }
}

// Export singleton instance
export const toast = new Toast();

// Re-export Toaster component from sonner for convenience
export { Toaster } from 'sonner';
