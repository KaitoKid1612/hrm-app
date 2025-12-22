import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Building2, Upload } from 'lucide-react';
import { getImageUrl } from '@/lib/image-utils';

interface CompanyMediaUploadProps {
  logo?: string;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CompanyMediaUpload = ({ logo, onLogoUpload }: CompanyMediaUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <Label>Logo công ty</Label>
      <div className="mt-2 flex items-center gap-6">
        <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
          {logo ? (
            <img
              src={getImageUrl(logo)}
              alt="Company logo"
              className="w-full h-full object-cover"
            />
          ) : (
            <Building2 className="w-12 h-12 text-gray-400" />
          )}
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onLogoUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            Tải lên logo
          </Button>
          <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF tối đa 5MB</p>
        </div>
      </div>
    </div>
  );
};
