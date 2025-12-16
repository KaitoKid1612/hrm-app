import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { User, Camera, Loader2 } from 'lucide-react';

interface ProfileAvatarProps {
  avatar?: string;
  isUploading: boolean;
  onAvatarChange: (file: File) => void;
}

export const ProfileAvatar = ({ avatar, isUploading, onAvatarChange }: ProfileAvatarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAvatarChange(file);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Ảnh đại diện</h2>
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center overflow-hidden">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-white" />
            )}
          </div>
          <button
            onClick={handleAvatarClick}
            disabled={isUploading}
            className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white shadow-lg transition-colors disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Ảnh JPG, PNG hoặc GIF. Tối đa 5MB.</p>
          <Button variant="outline" size="sm" onClick={handleAvatarClick} disabled={isUploading}>
            Thay đổi ảnh
          </Button>
        </div>
      </div>
    </div>
  );
};
