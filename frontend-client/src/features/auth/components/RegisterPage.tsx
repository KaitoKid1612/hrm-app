import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Loader2,
  Briefcase,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { ROUTES } from '@/constants';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'CANDIDATE' as 'CANDIDATE' | 'EMPLOYER',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await register(formData);

      // Role-based redirect
      if (response?.role === 'EMPLOYER') {
        navigate(ROUTES.COMPANY_DASHBOARD);
      } else {
        navigate(ROUTES.DASHBOARD);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-pink-50 flex">
      {/* Left Side - Image/Illustration */}
      <div className="hidden lg:flex lg:flex-1 bg-linear-to-br from-purple-600 to-pink-600 items-center justify-center p-12">
        <div className="max-w-md text-white space-y-6">
          <h2 className="text-4xl font-bold">Bắt đầu hành trình nghề nghiệp</h2>
          <p className="text-lg text-purple-100">
            Tham gia cùng hàng ngàn ứng viên đang tìm kiếm cơ hội việc làm tại Vũng Áng
          </p>
          <div className="space-y-4 pt-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Miễn phí 100%</h3>
                <p className="text-purple-100">Tạo tài khoản và ứng tuyển hoàn toàn miễn phí</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center">
            <Link
              to={ROUTES.HOME}
              className="inline-flex items-center text-sm text-gray-600 hover:text-purple-600 mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Về trang chủ
            </Link>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-linear-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng ký tài khoản</h1>
            <p className="text-gray-600">Tạo tài khoản để bắt đầu tìm việc</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-top-5">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <span className="text-sm text-red-800">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Bạn là? <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.role === 'CANDIDATE'
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="CANDIDATE"
                    checked={formData.role === 'CANDIDATE'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <User className="w-5 h-5" />
                  <span className="font-medium">Ứng viên</span>
                </label>
                <label
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.role === 'EMPLOYER'
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="EMPLOYER"
                    checked={formData.role === 'EMPLOYER'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <Briefcase className="w-5 h-5" />
                  <span className="font-medium">Nhà tuyển dụng</span>
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                Họ và tên <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="pl-12 h-12 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Nguyễn Văn A"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                Email <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-12 h-12 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
                Mật khẩu <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="pl-12 h-12 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Tối thiểu 6 ký tự</p>
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                Số điện thoại
              </Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-12 h-12 rounded-xl border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="0123456789"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2 block">
                Địa chỉ
              </Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="flex w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pl-12 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  placeholder="123 Đường ABC, Quận XYZ, Thành phố..."
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Đang đăng ký...
                </>
              ) : (
                'Đăng ký'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <Link
                to={ROUTES.LOGIN}
                className="text-purple-600 hover:text-pink-600 font-semibold transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
