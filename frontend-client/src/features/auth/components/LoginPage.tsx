import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Loader2, Briefcase, AlertCircle, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/constants';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await login({ email, password });
      const returnUrl = searchParams.get('returnUrl');

      // Role-based redirect
      if (returnUrl) {
        navigate(returnUrl);
      } else if (response?.role === 'EMPLOYER') {
        navigate(ROUTES.COMPANY_DASHBOARD);
      } else if (response?.role === 'CANDIDATE') {
        navigate(ROUTES.DASHBOARD);
      } else {
        navigate(ROUTES.DASHBOARD);
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      // Extract error message from API response
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link
              to={ROUTES.HOME}
              className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Về trang chủ
            </Link>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h1>
            <p className="text-gray-600">Chào mừng bạn quay trở lại!</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-top-5">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <span className="text-sm text-red-800">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-12 h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
                Mật khẩu
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-12 h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <Link
                to={ROUTES.REGISTER}
                className="hover:text-indigo-600 font-semibold transition-colors text-white"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Illustration */}
      <div className="hidden lg:flex lg:flex-1 bg-linear-to-br from-blue-600 to-indigo-700 items-center justify-center p-12">
        <div className="max-w-md text-white space-y-6">
          <h2 className="text-4xl font-bold">Vũng Áng Jobs</h2>
          <p className="text-lg text-blue-100">
            Nền tảng tuyển dụng hàng đầu tại Vũng Áng. Kết nối ứng viên với các cơ hội việc làm tốt
            nhất.
          </p>
          <div className="space-y-4 pt-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Hàng ngàn việc làm</h3>
                <p className="text-blue-100">Khám phá cơ hội nghề nghiệp phù hợp với bạn</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Login as default };
export { Login as LoginPage };
