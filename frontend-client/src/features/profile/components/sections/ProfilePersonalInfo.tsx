import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, Phone, Calendar, MapPin } from 'lucide-react';

interface ProfilePersonalInfoProps {
  formData: {
    name: string;
    phone: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    dateOfBirth: string;
    address: string;
    city: string;
    country: string;
    bio: string;
  };
  userEmail?: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void;
}

export const ProfilePersonalInfo = ({
  formData,
  userEmail,
  onChange,
}: ProfilePersonalInfoProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cá nhân</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">
            <User className="w-4 h-4 inline mr-2" />
            Họ và tên <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={onChange}
            required
            placeholder="Nguyễn Văn A"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="email">
            <Mail className="w-4 h-4 inline mr-2" />
            Email
          </Label>
          <Input id="email" value={userEmail} disabled className="mt-2 bg-gray-50" />
        </div>

        <div>
          <Label htmlFor="phone">
            <Phone className="w-4 h-4 inline mr-2" />
            Số điện thoại
          </Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            placeholder="0123456789"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="gender">Giới tính</Label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={onChange}
            className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="MALE">Nam</option>
            <option value="FEMALE">Nữ</option>
            <option value="OTHER">Khác</option>
          </select>
        </div>

        <div>
          <Label htmlFor="dateOfBirth">
            <Calendar className="w-4 h-4 inline mr-2" />
            Ngày sinh
          </Label>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={onChange}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="city">
            <MapPin className="w-4 h-4 inline mr-2" />
            Thành phố
          </Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={onChange}
            placeholder="Hà Nội"
            className="mt-2"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="address">Địa chỉ</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={onChange}
            placeholder="123 Đường ABC, Quận XYZ"
            className="mt-2"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="bio">Giới thiệu bản thân</Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={onChange}
            rows={4}
            placeholder="Viết vài dòng giới thiệu về bản thân..."
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
};
