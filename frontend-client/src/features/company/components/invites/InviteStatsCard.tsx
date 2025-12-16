import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface InviteStatsCardProps {
  candidateCount: number;
  isSending: boolean;
  isDisabled: boolean;
  onSend: () => void;
}

export const InviteStatsCard = ({
  candidateCount,
  isSending,
  isDisabled,
  onSend,
}: InviteStatsCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <Button onClick={onSend} disabled={isDisabled} className="w-full" size="lg">
          {isSending ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Đang gửi...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Gửi lời mời ({candidateCount || '...'} ứng viên)
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
