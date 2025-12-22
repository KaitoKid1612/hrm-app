import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCompanyProfile } from '../hooks/useCompanyProfile';
import { CompanyBasicInfo } from './profile/CompanyBasicInfo';
import { CompanyContactInfo } from './profile/CompanyContactInfo';
import { CompanyMediaUpload } from './profile/CompanyMediaUpload';
import { Building2, Save, Users, Facebook, Linkedin, Twitter, Plus, X } from 'lucide-react';

export const CompanyProfilePage = () => {
  const { profile, isLoading, updateProfile, uploadLogo, reload } = useCompanyProfile();
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
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Sync form data with profile when it loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        description: profile.description || '',
        website: profile.website || '',
        industry: profile.industry || '',
        size: profile.size || '',
        address: profile.address || '',
        city: profile.city || '',
        country: profile.country || 'Việt Nam',
        phone: profile.phone || '',
        email: profile.email || '',
        foundedYear: profile.foundedYear || new Date().getFullYear(),
        culture: profile.culture || '',
        facebook: profile.socialLinks?.facebook || '',
        linkedin: profile.socialLinks?.linkedin || '',
        twitter: profile.socialLinks?.twitter || '',
      });
      setBenefits(profile.benefits || []);
    }
  }, [profile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
    setLogoFile(file);
    setErrorMessage('');
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
      // Upload logo first if there's a new file
      if (logoFile) {
        await uploadLogo(logoFile);
      }

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

      // Clear preview after successful save
      setLogoPreview(null);
      setLogoFile(null);

      // Reload to get updated data
      await reload();

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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            Hồ sơ công ty
          </h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin công ty của bạn</p>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isSaving}
          className="gap-2 bg-blue-500 hover:bg-blue-600"
        >
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
            <CompanyMediaUpload
              logo={logoPreview || profile?.logo}
              onLogoUpload={handleLogoUpload}
            />
            <CompanyBasicInfo
              formData={{
                name: formData.name,
                description: formData.description,
                industry: formData.industry,
                size: formData.size,
                foundedYear: formData.foundedYear,
              }}
              onChange={handleInputChange}
            />
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin liên hệ</CardTitle>
          </CardHeader>
          <CardContent>
            <CompanyContactInfo
              formData={{
                address: formData.address,
                city: formData.city,
                country: formData.country,
                phone: formData.phone,
                email: formData.email,
                website: formData.website,
              }}
              onChange={handleInputChange}
            />
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
          <Button type="submit" disabled={isSaving} className="gap-2 bg-blue-500 hover:bg-blue-600">
            <Save className="w-4 h-4" />
            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CompanyProfilePage;
