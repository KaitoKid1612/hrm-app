import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/core/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
})
export class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    console.log('=== NEW CONNECTION ATTEMPT ===');
    console.log('Socket ID:', client.id);
    console.log('Auth token exists:', !!client.handshake.auth.token);

    try {
      const token = client.handshake.auth.token;
      if (!token) {
        console.log('❌ No token provided');
        client.disconnect();
        return;
      }

      console.log('Token received:', token.substring(0, 20) + '...');

      // Verify JWT token manually with secret from ConfigService
      console.log('Attempting JWT verification...');
      const secret = this.configService.get<string>('JWT_SECRET');
      if (!secret) {
        console.log('❌ JWT_SECRET not configured');
        client.disconnect();
        return;
      }
      const payload = jwt.verify(token, secret) as { sub?: string; userId?: string };
      console.log('JWT verified successfully. Payload:', payload);

      client.userId = payload.sub || payload.userId;
      if (!client.userId) {
        console.log('❌ No userId in token payload');
        client.disconnect();
        return;
      }

      console.log('User ID extracted:', client.userId);
      this.connectedUsers.set(client.userId, client.id);

      // Join rooms for all user's conversations
      console.log('Loading conversations for user...');
      const conversations = await this.prisma.conversationParticipant.findMany({
        where: { userId: client.userId },
        select: { conversationId: true },
      });

      console.log('Found', conversations.length, 'conversations');

      conversations.forEach((conv) => {
        client.join(`conversation:${conv.conversationId}`);
      });

      // Notify user is online
      this.server.emit('user:online', { userId: client.userId });
      console.log('✅ User', client.userId, 'connected successfully');
    } catch (error) {
      console.error('❌ Connection error:', error);
      console.error('Error details:', error instanceof Error ? error.message : error);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      this.connectedUsers.delete(client.userId);
      this.server.emit('user:offline', { userId: client.userId });
    }
  }

  @SubscribeMessage('message:send')
  async handleMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string; content: string },
  ) {
    try {
      if (!client.userId) {
        return { success: false, error: 'User not authenticated' };
      }
      const message = await this.prisma.message.create({
        data: {
          conversationId: data.conversationId,
          senderId: client.userId,
          content: data.content,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      });

      // Update conversation's last message
      await this.prisma.conversation.update({
        where: { id: data.conversationId },
        data: { updatedAt: new Date() },
      });

      // Emit to all users in the conversation room
      this.server.to(`conversation:${data.conversationId}`).emit('message:new', message);

      return { success: true, message };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  @SubscribeMessage('message:typing')
  handleTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string; isTyping: boolean },
  ) {
    client.to(`conversation:${data.conversationId}`).emit('message:typing', {
      userId: client.userId,
      conversationId: data.conversationId,
      isTyping: data.isTyping,
    });
  }

  @SubscribeMessage('message:read')
  async handleMessageRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    try {
      await this.prisma.message.updateMany({
        where: {
          conversationId: data.conversationId,
          senderId: { not: client.userId },
          isRead: false,
        },
        data: { isRead: true },
      });

      this.server.to(`conversation:${data.conversationId}`).emit('message:read', {
        conversationId: data.conversationId,
        userId: client.userId,
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Helper method to join a new conversation
  async joinConversation(userId: string, conversationId: string) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      const socket = this.server.sockets.sockets.get(socketId);
      if (socket) {
        socket.join(`conversation:${conversationId}`);
      }
    }
  }

  // Helper method to notify new conversation
  notifyNewConversation(userId: string, conversation: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('conversation:new', conversation);
    }
  }
}
