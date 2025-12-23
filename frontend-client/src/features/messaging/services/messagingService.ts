import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'EMPLOYER' | 'CANDIDATE' | 'ADMIN';
  company?: {
    id: string;
    name: string;
    logo?: string;
  };
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachments?: string[];
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  sender?: User;
}

export interface Conversation {
  id: string;
  userId: string;
  jobId?: string;
  isGroup: boolean;
  name?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  participants?: Array<{
    userId: string;
    conversation: {
      user: User;
    };
  }>;
  messages?: Message[];
  unreadCount?: number;
}

export interface CreateConversationDto {
  recipientId: string;
  jobId?: string;
  message?: string;
}

export interface SendMessageDto {
  content: string;
  attachments?: string[];
}

class MessagingService {
  async createConversation(data: CreateConversationDto): Promise<Conversation> {
    const response = await axios.post(`${API_BASE_URL}/messaging/conversations`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }

  async getConversations(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ data: Conversation[]; total: number; page: number; limit: number }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const response = await axios.get(
      `${API_BASE_URL}/messaging/conversations?${queryParams.toString()}`,
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  }

  async getConversationById(conversationId: string): Promise<Conversation> {
    const response = await axios.get(`${API_BASE_URL}/messaging/conversations/${conversationId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }

  async sendMessage(conversationId: string, data: SendMessageDto): Promise<Message> {
    const response = await axios.post(
      `${API_BASE_URL}/messaging/conversations/${conversationId}/messages`,
      data,
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  }

  async getMessages(
    conversationId: string,
    params?: { page?: number; limit?: number },
  ): Promise<{ data: Message[]; total: number; page: number; limit: number }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await axios.get(
      `${API_BASE_URL}/messaging/conversations/${conversationId}/messages?${queryParams.toString()}`,
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  }

  async markAsRead(conversationId: string): Promise<void> {
    await axios.patch(
      `${API_BASE_URL}/messaging/conversations/${conversationId}/read`,
      {},
      {
        headers: getAuthHeaders(),
      },
    );
  }

  async getUnreadCount(): Promise<number> {
    const response = await axios.get(`${API_BASE_URL}/messaging/unread-count`, {
      headers: getAuthHeaders(),
    });
    return response.data.count || 0;
  }

  async deleteConversation(conversationId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/messaging/conversations/${conversationId}`, {
      headers: getAuthHeaders(),
    });
  }
}

export const messagingService = new MessagingService();
