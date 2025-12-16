import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { UpdateProfileRequest } from '../../services/settingsService';

interface ProfileTabProps {
  profileForm: UpdateProfileRequest;
  isSaving: boolean;
  onFormChange: (form: UpdateProfileRequest) => void;
  onSave: () => void;
}

export const ProfileTab = ({ profileForm, isSaving, onFormChange, onSave }: ProfileTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cá nhân</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Họ và tên</Label>
            <Input
              id="name"
              value={profileForm.name}
              onChange={(e) => onFormChange({ ...profileForm, name: e.target.value })}
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div>
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              value={profileForm.phone}
              onChange={(e) => onFormChange({ ...profileForm, phone: e.target.value })}
              placeholder="0901234567"
            />
          </div>
          <div>
            <Label htmlFor="city">Thành phố</Label>
            <Input
              id="city"
              value={profileForm.city}
              onChange={(e) => onFormChange({ ...profileForm, city: e.target.value })}
              placeholder="Hà Nội"
            />
          </div>
          <div>
            <Label htmlFor="currentJobTitle">Chức danh hiện tại</Label>
            <Input
              id="currentJobTitle"
              value={profileForm.currentJobTitle}
              onChange={(e) => onFormChange({ ...profileForm, currentJobTitle: e.target.value })}
              placeholder="Senior Developer"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Địa chỉ</Label>
          <Input
            id="address"
            value={profileForm.address}
            onChange={(e) => onFormChange({ ...profileForm, address: e.target.value })}
            placeholder="123 Đường ABC, Quận XYZ"
          />
        </div>

        <div>
          <Label htmlFor="bio">Giới thiệu bản thân</Label>
          <Textarea
            id="bio"
            rows={4}
            value={profileForm.bio}
            onChange={(e) => onFormChange({ ...profileForm, bio: e.target.value })}
            placeholder="Viết vài dòng giới thiệu về bản thân..."
          />
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Liên kết mạng xã hội</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="linkedinUrl">LinkedIn</Label>
              <Input
                id="linkedinUrl"
                value={profileForm.linkedinUrl}
                onChange={(e) => onFormChange({ ...profileForm, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/your-profile"
              />
            </div>
            <div>
              <Label htmlFor="githubUrl">GitHub</Label>
              <Input
                id="githubUrl"
                value={profileForm.githubUrl}
                onChange={(e) => onFormChange({ ...profileForm, githubUrl: e.target.value })}
                placeholder="https://github.com/your-username"
              />
            </div>
            <div>
              <Label htmlFor="websiteUrl">Website</Label>
              <Input
                id="websiteUrl"
                value={profileForm.websiteUrl}
                onChange={(e) => onFormChange({ ...profileForm, websiteUrl: e.target.value })}
                placeholder="https://your-website.com"
              />
            </div>
          </div>
        </div>

        <Button onClick={onSave} disabled={isSaving} className="w-full">
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Lưu thay đổi
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
