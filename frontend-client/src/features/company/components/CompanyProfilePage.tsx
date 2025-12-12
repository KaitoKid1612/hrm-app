import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCompanyProfile } from '../hooks/useCompanyProfile';
import {
  Building2,
  Upload,
  Save,
  Globe,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Users,
  Facebook,
  Linkedin,
  Twitter,
  Plus,
  X,
} from 'lucide-react';

const industrys = [
  'Công nghệ thông tin',
  'Tài chính - Ngân hàng',
  'Bất động sản',
  'Y tế - Dược phẩm',
  'Giáo dục - Đào tạo',
  'Thương mại - Dịch vụ',
  'Sản xuất',
  'Du lịch - Khách sạn',
  'Truyền thông - Marketing',
  'Khác',
];

const companySizes = [
  '1-10 nhân viên',
  '11-50 nhân viên',
  '51-200 nhân viên',
  '201-500 nhân viên',
  '501-1000 nhân viên',
  '1000+ nhân viên',
];

export const CompanyProfilePage = () => {
  const { profile, isLoading, updateProfile, uploadLogo } = useCompanyProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    description: profile?.description || '',
    website: profile?.website || '',
    industry: profile?.industry || '',
    size: profile?.size || '',
    address: profile?.address || '',
    city: profile?.city || '',
    country: profile?.country || 'Việt Nam',
    phone: profile?.phone || '',
    email: profile?.email || '',
    foundedYear: profile?.foundedYear || new Date().getFullYear(),
    culture: profile?.culture || '',
    facebook: profile?.socialLinks?.facebook || '',
    linkedin: profile?.socialLinks?.linkedin || '',
    twitter: profile?.socialLinks?.twitter || '',
  });

  const [benefits, setBenefits] = useState<string[]>(profile?.benefits || []);
  const [newBenefit, setNewBenefit] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Kích thước file không được vượt quá 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Vui lòng chọn file ảnh');
      return;
    }

    try {
      await uploadLogo(file);
      setSuccessMessage('Cập nhật logo thành công!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      setErrorMessage('Có lỗi khi tải logo lên');
    }
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim() && !benefits.includes(newBenefit.trim())) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit('');
    }
  };

  const handleRemoveBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await updateProfile({
        name: formData.name,
        description: formData.description,
        website: formData.website,
        industry: formData.industry,
        size: formData.size,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        phone: formData.phone,
        email: formData.email,
        foundedYear: formData.foundedYear,
        culture: formData.culture,
        benefits,
        socialLinks: {
          facebook: formData.facebook,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
        },
      });

      setSuccessMessage('Cập nhật hồ sơ công ty thành công!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Có lỗi xảy ra');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            Hồ sơ công ty
          </h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin công ty của bạn</p>
        </div>
        <Button onClick={handleSubmit} disabled={isSaving} className="gap-2">
          <Save className="w-4 h-4" />
          {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo & Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo Upload */}
            <div>
              <Label>Logo công ty</Label>
              <div className="mt-2 flex items-center gap-6">
                <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                  {profile?.logo ? (
                    <img
                      src={profile.logo}
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
                    onChange={handleLogoUpload}
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

            {/* Company Name */}
            <div>
              <Label htmlFor="name">Tên công ty *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Ví dụ: FPT Software"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Mô tả công ty *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={5}
                placeholder="Giới thiệu về công ty của bạn..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Industry */}
              <div>
                <Label htmlFor="industry">Lĩnh vực</Label>
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn lĩnh vực</option>
                  {industrys.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company Size */}
              <div>
                <Label htmlFor="size">Quy mô</Label>
                <select
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn quy mô</option>
                  {companySizes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Founded Year */}
            <div>
              <Label htmlFor="foundedYear">
                <Calendar className="w-4 h-4 inline mr-1" />
                Năm thành lập
              </Label>
              <Input
                id="foundedYear"
                name="foundedYear"
                type="number"
                value={formData.foundedYear}
                onChange={handleInputChange}
                min="1900"
                max={new Date().getFullYear()}
                placeholder="2020"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin liên hệ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">
                <MapPin className="w-4 h-4 inline mr-1" />
                Địa chỉ *
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  placeholder="Hà Nội"
                />
              </div>
              <div>
                <Label htmlFor="country">Quốc gia</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                onChange={handleInputChange}
                placeholder="https://company.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Culture & Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Văn hóa & Quyền lợi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Culture */}
            <div>
              <Label htmlFor="culture">
                <Users className="w-4 h-4 inline mr-1" />
                Văn hóa công ty
              </Label>
              <Textarea
                id="culture"
                name="culture"
                value={formData.culture}
                onChange={handleInputChange}
                rows={4}
                placeholder="Mô tả về văn hóa làm việc tại công ty..."
              />
            </div>

            {/* Benefits */}
            <div>
              <Label>Quyền lợi</Label>
              <div className="space-y-3">
                {/* Benefits List */}
                {benefits.length > 0 && (
                  <div className="space-y-2">
                    {benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-gray-700">{benefit}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBenefit(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Benefit */}
                <div className="flex gap-2">
                  <Input
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    placeholder="Nhập quyền lợi mới..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddBenefit();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddBenefit}
                    variant="outline"
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Mạng xã hội</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="facebook">
                <Facebook className="w-4 h-4 inline mr-1" />
                Facebook
              </Label>
              <Input
                id="facebook"
                name="facebook"
                type="url"
                value={formData.facebook}
                onChange={handleInputChange}
                placeholder="https://facebook.com/company"
              />
            </div>

            <div>
              <Label htmlFor="linkedin">
                <Linkedin className="w-4 h-4 inline mr-1" />
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                name="linkedin"
                type="url"
                value={formData.linkedin}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/company/company"
              />
            </div>

            <div>
              <Label htmlFor="twitter">
                <Twitter className="w-4 h-4 inline mr-1" />
                Twitter
              </Label>
              <Input
                id="twitter"
                name="twitter"
                type="url"
                value={formData.twitter}
                onChange={handleInputChange}
                placeholder="https://twitter.com/company"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isSaving} className="gap-2">
            <Save className="w-4 h-4" />
            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CompanyProfilePage;
