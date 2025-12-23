import { io, Socket } from 'socket.io-client';
import { Message, Conversation } from './messagingService';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Array<(...args: unknown[]) => void>> = new Map();

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Listen for new messages
    this.socket.on('message:new', (message: Message) => {
      this.emit('message:new', message);
    });

    // Listen for typing indicator
    this.socket.on(
      'message:typing',
      (data: { userId: number; conversationId: number; isTyping: boolean }) => {
        this.emit('message:typing', data);
      },
    );

    // Listen for read receipts
    this.socket.on('message:read', (data: { conversationId: number; userId: number }) => {
      this.emit('message:read', data);
    });

    // Listen for new conversations
    this.socket.on('conversation:new', (conversation: Conversation) => {
      this.emit('conversation:new', conversation);
    });

    // Listen for user online/offline status
    this.socket.on('user:online', (data: { userId: number }) => {
      this.emit('user:online', data);
    });

    this.socket.on('user:offline', (data: { userId: number }) => {
      this.emit('user:offline', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  sendMessage(conversationId: string, content: string) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }
    this.socket.emit('message:send', { conversationId, content });
  }

  sendTyping(conversationId: string, isTyping: boolean) {
    if (!this.socket?.connected) return;
    this.socket.emit('message:typing', { conversationId, isTyping });
  }

  markAsRead(conversationId: string) {
    if (!this.socket?.connected) return;
    this.socket.emit('message:read', { conversationId });
  }

  // Event listener management
  on(event: string, callback: (...args: unknown[]) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  off(event: string, callback: (...args: unknown[]) => void) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: unknown) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
