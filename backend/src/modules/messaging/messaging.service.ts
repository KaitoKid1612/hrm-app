import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/core/prisma/prisma.service';
import {
  CreateConversationDto,
  SendMessageDto,
  UpdateConversationDto,
  QueryConversationsDto,
  QueryMessagesDto,
  MarkAsReadDto,
} from './dto/message.dto';

@Injectable()
export class MessagingService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new conversation or get existing one
   */
  async createConversation(userId: string, dto: CreateConversationDto) {
    // Check if conversation already exists between these users
    const existingConversation = await this.prisma.conversation.findFirst({
      where: {
        OR: [
          {
            userId: userId,
            participants: {
              some: {
                userId: dto.recipientId,
              },
            },
          },
          {
            userId: dto.recipientId,
            participants: {
              some: {
                userId: userId,
              },
            },
          },
        ],
        isGroup: false,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
        participants: {
          include: {
            conversation: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                    role: true,
                  },
                },
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (existingConversation) {
      // If initial message provided, send it
      if (dto.message) {
        await this.sendMessage(userId, existingConversation.id, {
          content: dto.message,
        });
      }
      return existingConversation;
    }

    // Verify recipient exists
    const recipient = await this.prisma.user.findUnique({
      where: { id: dto.recipientId },
    });

    if (!recipient) {
      throw new NotFoundException('Recipient not found');
    }

    if (recipient.id === userId) {
      throw new BadRequestException('Cannot create conversation with yourself');
    }

    // Create new conversation
    const conversation = await this.prisma.conversation.create({
      data: {
        userId: userId,
        jobId: dto.jobId,
        isGroup: false,
        participants: {
          create: [
            {
              userId: userId,
            },
            {
              userId: dto.recipientId,
            },
          ],
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
        participants: {
          include: {
            conversation: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                    role: true,
                  },
                },
              },
            },
          },
        },
        messages: true,
      },
    });

    // Send initial message if provided
    if (dto.message) {
      await this.sendMessage(userId, conversation.id, {
        content: dto.message,
      });
    }

    return conversation;
  }

  /**
   * Get user's conversations with pagination
   */
  async getUserConversations(userId: string, query: QueryConversationsDto) {
    const { page = 1, limit = 20, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      participants: {
        some: {
          userId: userId,
        },
      },
    };

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          lastMessage: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [conversations, total] = await Promise.all([
      this.prisma.conversation.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          lastMessageAt: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              role: true,
              company: {
                select: {
                  id: true,
                  name: true,
                  logo: true,
                },
              },
            },
          },
          participants: {
            include: {
              conversation: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      avatar: true,
                      role: true,
                      company: {
                        select: {
                          id: true,
                          name: true,
                          logo: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          _count: {
            select: {
              messages: {
                where: {
                  isRead: false,
                  senderId: {
                    not: userId,
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.conversation.count({ where }),
    ]);

    return {
      data: conversations,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get conversation by ID
   */
  async getConversationById(userId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            company: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
          },
        },
        participants: {
          include: {
            conversation: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                    role: true,
                    company: {
                      select: {
                        id: true,
                        name: true,
                        logo: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Check if user is participant
    const isParticipant = conversation.participants.some((p) => p.userId === userId);

    if (!isParticipant) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    return conversation;
  }

  /**
   * Send a message in a conversation
   */
  async sendMessage(userId: string, conversationId: string, dto: SendMessageDto) {
    // Verify user is participant
    await this.getConversationById(userId, conversationId);

    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        content: dto.content,
        attachments: dto.attachments || [],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
      },
    });

    // Update conversation's last message
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessage: dto.content.substring(0, 100),
        lastMessageAt: new Date(),
      },
    });

    return message;
  }

  /**
   * Get messages in a conversation with pagination
   */
  async getMessages(userId: string, conversationId: string, query: QueryMessagesDto) {
    // Verify user is participant
    await this.getConversationById(userId, conversationId);

    const { page = 1, limit = 50, before } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      conversationId,
    };

    if (before) {
      const beforeMessage = await this.prisma.message.findUnique({
        where: { id: before },
      });
      if (beforeMessage) {
        where.createdAt = {
          lt: beforeMessage.createdAt,
        };
      }
    }

    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              role: true,
            },
          },
        },
      }),
      this.prisma.message.count({ where }),
    ]);

    return {
      data: messages.reverse(), // Return in chronological order
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Mark messages as read
   */
  async markAsRead(userId: string, conversationId: string, dto: MarkAsReadDto) {
    // Verify user is participant
    await this.getConversationById(userId, conversationId);

    const where: any = {
      conversationId,
      senderId: {
        not: userId,
      },
      isRead: false,
    };

    if (dto.messageIds && dto.messageIds.length > 0) {
      where.id = {
        in: dto.messageIds,
      };
    }

    const updated = await this.prisma.message.updateMany({
      where,
      data: {
        isRead: true,
      },
    });

    // Update participant's lastReadAt
    await this.prisma.conversationParticipant.updateMany({
      where: {
        conversationId,
        userId,
      },
      data: {
        lastReadAt: new Date(),
      },
    });

    return {
      markedCount: updated.count,
    };
  }

  /**
   * Update conversation (e.g., rename group)
   */
  async updateConversation(userId: string, conversationId: string, dto: UpdateConversationDto) {
    // Verify user is participant
    await this.getConversationById(userId, conversationId);

    const updated = await this.prisma.conversation.update({
      where: { id: conversationId },
      data: dto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
        participants: true,
      },
    });

    return updated;
  }

  /**
   * Delete conversation (for current user)
   */
  async deleteConversation(userId: string, conversationId: string) {
    // Verify user is participant
    await this.getConversationById(userId, conversationId);

    // Remove user from participants
    await this.prisma.conversationParticipant.deleteMany({
      where: {
        conversationId,
        userId,
      },
    });

    // Check if conversation has any participants left
    const remainingParticipants = await this.prisma.conversationParticipant.count({
      where: {
        conversationId,
      },
    });

    // If no participants left, delete the conversation
    if (remainingParticipants === 0) {
      await this.prisma.conversation.delete({
        where: { id: conversationId },
      });
    }

    return { message: 'Conversation deleted successfully' };
  }

  /**
   * Get unread messages count
   */
  async getUnreadCount(userId: string) {
    const count = await this.prisma.message.count({
      where: {
        conversation: {
          participants: {
            some: {
              userId,
            },
          },
        },
        senderId: {
          not: userId,
        },
        isRead: false,
      },
    });

    return { unreadCount: count };
  }
}
