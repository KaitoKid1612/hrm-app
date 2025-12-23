import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { messagingService } from '../services/messagingService';
import { toast } from '@/lib/toast';
import { MessageSquare } from 'lucide-react';
import { ROUTES } from '@/constants';

interface StartChatButtonProps {
  recipientId: string;
  recipientName: string;
  jobId?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export const StartChatButton = ({
  recipientId,
  recipientName,
  jobId,
  variant = 'outline',
  size = 'sm',
  className = '',
}: StartChatButtonProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartChat = async () => {
    try {
      setIsLoading(true);

      // Create or get existing conversation
      await messagingService.createConversation({
        recipientId,
        jobId,
        message: `Xin chào! Tôi muốn trao đổi về${jobId ? ' công việc này' : ' hồ sơ ứng tuyển'}.`,
      });

      // Navigate to messages page with the conversation
      navigate(ROUTES.MESSAGES);

      toast.success(`Đã mở cuộc trò chuyện với ${recipientName}`);
    } catch (error) {
      console.error('Error starting chat:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Không thể bắt đầu cuộc trò chuyện');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleStartChat}
      disabled={isLoading}
      className={className}
    >
      <MessageSquare className="w-4 h-4 mr-2" />
      {isLoading ? 'Đang mở...' : 'Nhắn tin'}
    </Button>
  );
};
