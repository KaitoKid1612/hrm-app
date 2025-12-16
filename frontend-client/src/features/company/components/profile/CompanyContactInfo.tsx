import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';

interface CompanyContactInfoProps {
  formData: {
    address: string;
    city: string;
    country: string;
    phone: string;
    email: string;
    website: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CompanyContactInfo = ({ formData, onChange }: CompanyContactInfoProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="address">
          <MapPin className="w-4 h-4 inline mr-1" />
          Địa chỉ *
        </Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={onChange}
          required
          placeholder="Số nhà, tên đường"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">Thành phố</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={onChange}
            placeholder="Hà Nội"
          />
        </div>
        <div>
          <Label htmlFor="country">Quốc gia</Label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={onChange}
            placeholder="Việt Nam"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">
            <Phone className="w-4 h-4 inline mr-1" />
            Số điện thoại
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={onChange}
            placeholder="0123456789"
          />
        </div>
        <div>
          <Label htmlFor="email">
            <Mail className="w-4 h-4 inline mr-1" />
            Email liên hệ
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            placeholder="contact@company.com"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="website">
          <Globe className="w-4 h-4 inline mr-1" />
          Website
        </Label>
        <Input
          id="website"
          name="website"
          type="url"
          value={formData.website}
          onChange={onChange}
          placeholder="https://company.com"
        />
      </div>
    </div>
  );
};
