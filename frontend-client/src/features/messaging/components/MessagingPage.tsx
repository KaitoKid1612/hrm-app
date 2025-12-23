import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { messagingService, Conversation, Message, User } from '../services/messagingService';
import { socketService } from '../services/socketService';
import { toast } from '@/lib/toast';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { getImageUrl } from '@/lib/image-utils';
import {
  MessageSquare,
  Send,
  Search,
  ArrowLeft,
  Briefcase,
  Building2,
  User as UserIcon,
} from 'lucide-react';

// Simple Avatar component to avoid Radix UI conflict
const SimpleAvatar = ({
  src,
  alt,
  fallback,
}: {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
}) => {
  const [error, setError] = useState(false);

  return (
    <div className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
      {src && !error ? (
        <img
          src={src}
          alt={alt}
          className="aspect-square h-full w-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">{fallback}</div>
      )}
    </div>
  );
};

export const MessagingPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const currentUserId = localStorage.getItem('userId');

  // Connect to socket on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      socketService.connect(token);
    }

    // Socket event listeners
    const handleNewMessage = (message: Message) => {
      if (selectedConversation && message.conversationId === selectedConversation.id) {
        setMessages((prev) => {
          // Remove temp message if exists and add real message
          const filtered = prev.filter((m) => !m.id.toString().startsWith('temp-'));
          // Check if message already exists
          if (filtered.some((m) => m.id === message.id)) {
            return prev;
          }
          return [...filtered, message];
        });
        socketService.markAsRead(selectedConversation.id);
      }
      // Reload conversations to update last message
      loadConversations();
    };

    const handleTyping = (data: { userId: string; conversationId: string; isTyping: boolean }) => {
      if (selectedConversation && data.conversationId === selectedConversation.id) {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          if (data.isTyping) {
            newSet.add(data.userId);
          } else {
            newSet.delete(data.userId);
          }
          return newSet;
        });
      }
    };

    const handleNewConversation = () => {
      loadConversations();
    };

    socketService.on('message:new', handleNewMessage);
    socketService.on('message:typing', handleTyping);
    socketService.on('conversation:new', handleNewConversation);

    return () => {
      socketService.off('message:new', handleNewMessage);
      socketService.off('message:typing', handleTyping);
      socketService.off('conversation:new', handleNewConversation);
    };
  }, [selectedConversation]);

  useEffect(() => {
    loadConversations();
  }, [searchQuery]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      socketService.markAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);

  // Auto scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Instant scroll when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
      }, 100);
    }
  }, [selectedConversation?.id]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const response = await messagingService.getConversations({
        page: 1,
        limit: 50,
        search: searchQuery || undefined,
      });
      setConversations(response.data);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Không thể tải danh sách hội thoại');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await messagingService.getMessages(conversationId, {
        page: 1,
        limit: 100,
      });
      setMessages(response.data.reverse()); // Reverse to show oldest first
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Không thể tải tin nhắn');
    }
  };

  const handleTyping = () => {
    if (!selectedConversation) return;

    socketService.sendTyping(selectedConversation.id, true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketService.sendTyping(selectedConversation.id, false);
    }, 1000);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || isSending) return;

    const messageContent = newMessage.trim();
    try {
      setIsSending(true);
      setNewMessage('');

      // Optimistic update - add message to UI immediately
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        conversationId: selectedConversation.id,
        senderId: currentUserId || '',
        content: messageContent,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isRead: false,
        attachments: [],
      };
      setMessages((prev) => [...prev, tempMessage]);

      // Send via socket for real-time delivery
      socketService.sendMessage(selectedConversation.id, messageContent);
      socketService.sendTyping(selectedConversation.id, false);

      // Update last message in conversation list
      setConversations(
        conversations.map((conv) =>
          conv.id === selectedConversation.id
            ? { ...conv, lastMessage: messageContent, lastMessageAt: new Date().toISOString() }
            : conv,
        ),
      );
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Không thể gửi tin nhắn');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getOtherUser = (conversation: Conversation): User | undefined => {
    if (!conversation.participants) return conversation.user;

    const otherParticipant = conversation.participants.find((p) => p.userId !== currentUserId);
    return otherParticipant?.conversation?.user;
  };

  const getDisplayName = (user?: User) => {
    if (!user) return 'Unknown User';
    if (user.role === 'EMPLOYER' && user.company) {
      return user.company.name;
    }
    return user.name;
  };

  const getDisplayAvatar = (user?: User) => {
    if (!user) return undefined;
    if (user.role === 'EMPLOYER' && user.company?.logo) {
      return getImageUrl(user.company.logo);
    }
    return user.avatar ? getImageUrl(user.avatar) : undefined;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          Tin nhắn
        </h1>
        <p className="text-gray-600 mt-1">Trò chuyện với nhà tuyển dụng và ứng viên</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Hội thoại</CardTitle>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Chưa có hội thoại nào</p>
                </div>
              ) : (
                conversations.map((conversation) => {
                  const otherUser = getOtherUser(conversation);
                  const isSelected = selectedConversation?.id === conversation.id;
                  const hasUnread = (conversation.unreadCount || 0) > 0;

                  return (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                      } ${hasUnread ? 'bg-blue-50/30' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <SimpleAvatar
                          src={getDisplayAvatar(otherUser)}
                          alt={getDisplayName(otherUser)}
                          fallback={
                            otherUser?.role === 'EMPLOYER' ? (
                              <Building2 className="w-6 h-6" />
                            ) : (
                              <UserIcon className="w-6 h-6" />
                            )
                          }
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4
                              className={`font-medium text-gray-900 truncate ${hasUnread ? 'font-semibold' : ''}`}
                            >
                              {getDisplayName(otherUser)}
                            </h4>
                            {conversation.lastMessageAt && (
                              <span className="text-xs text-gray-500 ml-2">
                                {formatDistanceToNow(new Date(conversation.lastMessageAt), {
                                  addSuffix: true,
                                  locale: vi,
                                })}
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-sm truncate mt-1 ${hasUnread ? 'font-medium text-gray-900' : 'text-gray-600'}`}
                          >
                            {conversation.lastMessage || 'Chưa có tin nhắn'}
                          </p>
                          {conversation.jobId && (
                            <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                              <Briefcase className="w-3 h-3" />
                              <span>Về công việc</span>
                            </div>
                          )}
                        </div>
                        {hasUnread && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedConversation(null)}
                    className="lg:hidden"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <SimpleAvatar
                    src={getDisplayAvatar(getOtherUser(selectedConversation))}
                    alt={getDisplayName(getOtherUser(selectedConversation))}
                    fallback={
                      getOtherUser(selectedConversation)?.role === 'EMPLOYER' ? (
                        <Building2 className="w-5 h-5" />
                      ) : (
                        <UserIcon className="w-5 h-5" />
                      )
                    }
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {getDisplayName(getOtherUser(selectedConversation))}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {getOtherUser(selectedConversation)?.email}
                    </p>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="p-4">
                <div className="h-[450px] overflow-y-auto mb-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>Bắt đầu cuộc trò chuyện</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isOwn = message.senderId === currentUserId;
                      const sender = message.sender;

                      // Lấy thông tin hiển thị của người gửi tin nhắn
                      const senderDisplayName =
                        sender?.role === 'EMPLOYER' && sender?.company
                          ? sender.company.name
                          : sender?.name || 'Unknown User';

                      const senderDisplayAvatar =
                        sender?.role === 'EMPLOYER' && sender?.company?.logo
                          ? getImageUrl(sender.company.logo)
                          : sender?.avatar
                            ? getImageUrl(sender.avatar)
                            : undefined;

                      return (
                        <div
                          key={message.id}
                          className={`flex gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          {/* Avatar chỉ hiển thị cho tin nhắn từ người đối diện (bên trái) */}
                          {!isOwn && (
                            <SimpleAvatar
                              src={senderDisplayAvatar}
                              alt={senderDisplayName}
                              fallback={
                                sender?.role === 'EMPLOYER' ? (
                                  <Building2 className="w-5 h-5 text-gray-400" />
                                ) : (
                                  <UserIcon className="w-5 h-5 text-gray-400" />
                                )
                              }
                            />
                          )}

                          <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                              isOwn ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            {/* Hiển thị tên người gửi cho tin nhắn từ người đối diện */}
                            {!isOwn && (
                              <p className="text-xs font-semibold mb-1 text-gray-600 flex items-center gap-1">
                                {senderDisplayName}
                                {sender?.role === 'EMPLOYER' && <Briefcase className="w-3 h-3" />}
                              </p>
                            )}
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isOwn ? 'text-blue-100' : 'text-gray-500'
                              }`}
                            >
                              {formatDistanceToNow(new Date(message.createdAt), {
                                addSuffix: true,
                                locale: vi,
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Typing indicator */}
                  {typingUsers.size > 0 && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2">
                        <div className="flex gap-1">
                          <span
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: '0ms' }}
                          ></span>
                          <span
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: '150ms' }}
                          ></span>
                          <span
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: '300ms' }}
                          ></span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Nhập tin nhắn..."
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      handleTyping();
                    }}
                    onKeyPress={handleKeyPress}
                    disabled={isSending}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isSending}
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[600px]">
              <div className="text-center text-gray-500">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Chọn một cuộc hội thoại để bắt đầu</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
