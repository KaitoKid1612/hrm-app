import { toast as sonnerToast } from 'sonner';
import { AxiosError } from 'axios';

// Helper to extract error message from API response
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // Get message from API response
    const apiMessage = error.response?.data?.message;

    if (Array.isArray(apiMessage)) {
      return apiMessage.join(', ');
    }

    if (typeof apiMessage === 'string') {
      return apiMessage;
    }

    // Fallback to status code messages
    switch (error.response?.status) {
      case 400:
        return 'Dữ liệu không hợp lệ';
      case 401:
        return 'Bạn cần đăng nhập để thực hiện thao tác này';
      case 403:
        return 'Bạn không có quyền thực hiện thao tác này';
      case 404:
        return 'Không tìm thấy dữ liệu';
      case 409:
        return 'Dữ liệu đã tồn tại';
      case 500:
        return 'Lỗi máy chủ. Vui lòng thử lại sau';
      default:
        return error.message || 'Có lỗi xảy ra';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Có lỗi xảy ra';
};

// Toast wrappers
export const toast = {
  success: (message: string) => {
    sonnerToast.success(message, {
      duration: 3000,
    });
  },

  error: (error: unknown) => {
    const message = getErrorMessage(error);
    sonnerToast.error(message, {
      duration: 4000,
    });
  },

  info: (message: string) => {
    sonnerToast.info(message, {
      duration: 3000,
    });
  },

  warning: (message: string) => {
    sonnerToast.warning(message, {
      duration: 3000,
    });
  },

  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error?: string;
    },
  ) => {
    return sonnerToast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: (err) => messages.error || getErrorMessage(err),
    });
  },
};
