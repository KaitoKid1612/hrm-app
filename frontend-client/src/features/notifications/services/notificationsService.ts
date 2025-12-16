import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export enum NotificationType {
  APPLICATION_STATUS = 'application_status',
  NEW_JOB = 'new_job',
  JOB_DEADLINE = 'job_deadline',
  COMPANY_VERIFIED = 'company_verified',
  NEW_APPLICATION = 'new_application',
  NEW_MESSAGE = 'new_message',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  SYSTEM = 'system',
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: unknown;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  data: Notification[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UnreadCountResponse {
  count: number;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

class NotificationsService {
  async getNotifications(
    page: number = 1,
    limit: number = 20,
    isRead?: boolean,
  ): Promise<NotificationsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (isRead !== undefined) {
      params.append('isRead', isRead.toString());
    }

    const response = await axios.get(`${API_BASE_URL}/notifications?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }

  async getUnreadCount(): Promise<number> {
    const response = await axios.get<UnreadCountResponse>(
      `${API_BASE_URL}/notifications/unread-count`,
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data.count;
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    const response = await axios.patch<Notification>(
      `${API_BASE_URL}/notifications/${notificationId}/read`,
      {},
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  }

  async markAllAsRead(): Promise<{ count: number }> {
    const response = await axios.patch<{ count: number }>(
      `${API_BASE_URL}/notifications/read-all`,
      {},
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/notifications/${notificationId}`, {
      headers: getAuthHeaders(),
    });
  }

  async deleteAll(): Promise<void> {
    await axios.delete(`${API_BASE_URL}/notifications`, {
      headers: getAuthHeaders(),
    });
  }
}

export const notificationsService = new NotificationsService();
