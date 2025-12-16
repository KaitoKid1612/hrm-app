import { Button } from '@/components/ui/button';
import { InviteCandidate } from '../../services/inviteService';
import { X } from 'lucide-react';

interface InvitesListProps {
  candidates: InviteCandidate[];
  onRemove: (email: string) => void;
}

export const InvitesList = ({ candidates, onRemove }: InvitesListProps) => {
  if (candidates.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-3">Danh sách ứng viên ({candidates.length})</h3>
      <div className="space-y-2">
        {candidates.map((candidate, index) => (
          <div
            key={index}
            className="flex items-start justify-between p-3 bg-white border rounded-lg"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">{candidate.name}</p>
              <p className="text-sm text-gray-600">{candidate.email}</p>
              {candidate.phone && <p className="text-sm text-gray-600">{candidate.phone}</p>}
              {candidate.note && <p className="text-sm text-gray-500 italic">{candidate.note}</p>}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(candidate.email)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
