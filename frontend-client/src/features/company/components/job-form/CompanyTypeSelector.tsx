import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Building2, Home, UserCheck, CheckCircle } from 'lucide-react';
import { CompanyType } from '../../services/jobManagementService';
import { CompanyProfileData } from '../../services/companyProfileService';

interface CompanyTypeSelectorProps {
  company: CompanyProfileData | null;
  companyType: CompanyType;
  useExistingCompany: boolean;
  onCompanyTypeChange: (type: CompanyType) => void;
  onUseExistingChange: (value: boolean) => void;
  onCreateCompany: () => void;
}

export const CompanyTypeSelector = ({
  company,
  companyType,
  useExistingCompany,
  onCompanyTypeChange,
  onUseExistingChange,
  onCreateCompany,
}: CompanyTypeSelectorProps) => {
  return (
    <>
      {/* Company Info Banner */}
      {company && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{company.name}</h3>
                  {company.isVerified && <CheckCircle className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-sm text-gray-600">Công ty hiện tại của bạn</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Company Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Chọn loại hình đăng tuyển
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Company Selection Options */}
          {company && (
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="companySelection"
                  checked={useExistingCompany}
                  onChange={() => onUseExistingChange(true)}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Đăng dưới tên công ty hiện có</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Tin tuyển dụng sẽ hiển thị với tên: {company.name}
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="companySelection"
                  checked={!useExistingCompany}
                  onChange={() => onUseExistingChange(false)}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Đăng với loại hình khác</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Tạo hồ sơ mới cho hộ kinh doanh hoặc nhà tuyển dụng
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Company Type Options (only show when not using existing company or no company) */}
          {(!company || !useExistingCompany) && (
            <div className="space-y-3">
              <Label>Chọn loại hình:</Label>

              <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                <input
                  type="radio"
                  name="companyType"
                  value="COMPANY"
                  checked={companyType === 'COMPANY'}
                  onChange={(e) => {
                    onCompanyTypeChange(e.target.value as CompanyType);
                    onCreateCompany();
                  }}
                  className="w-4 h-4 mt-1 text-blue-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Công ty</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Doanh nghiệp, công ty có đăng ký kinh doanh chính thức
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-colors">
                <input
                  type="radio"
                  name="companyType"
                  value="SMALL_BUSINESS"
                  checked={companyType === 'SMALL_BUSINESS'}
                  onChange={(e) => onCompanyTypeChange(e.target.value as CompanyType)}
                  className="w-4 h-4 mt-1 text-green-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Hộ kinh doanh / Cá nhân</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Hộ kinh doanh nhỏ lẻ, cửa hàng, cá nhân tuyển dụng
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors">
                <input
                  type="radio"
                  name="companyType"
                  value="HEADHUNTER"
                  checked={companyType === 'HEADHUNTER'}
                  onChange={(e) => onCompanyTypeChange(e.target.value as CompanyType)}
                  className="w-4 h-4 mt-1 text-purple-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">Nhà tuyển dụng</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Headhunter, công ty tư vấn nhân sự, môi giới tuyển dụng
                  </p>
                </div>
              </label>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
