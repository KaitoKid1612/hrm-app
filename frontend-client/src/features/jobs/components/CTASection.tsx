import { useNavigate } from 'react-router-dom';
import { ArrowRight, UserPlus, Briefcase } from 'lucide-react';
import { ROUTES } from '@/constants';
import { useAuth } from '@/features/auth';

export const CTASection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-16 sm:py-20 bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">
            Sẵn Sàng Bắt Đầu Hành Trình Mới?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8">
            Hàng nghìn công ty đang tìm kiếm ứng viên tài năng như bạn
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate(ROUTES.REGISTER)}
                  className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-xl hover:scale-105"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Đăng ký ngay</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white/10 transition-all duration-200"
                >
                  Đăng nhập
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate(ROUTES.DASHBOARD)}
                className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-xl hover:scale-105"
              >
                <Briefcase className="w-5 h-5" />
                <span>Xem Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>

          <div className="mt-10 sm:mt-12 grid grid-cols-3 gap-4 sm:gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
              <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">100%</div>
              <div className="text-xs sm:text-sm text-white/80">Miễn phí</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
              <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">24/7</div>
              <div className="text-xs sm:text-sm text-white/80">Hỗ trợ</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
              <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">&lt;5 phút</div>
              <div className="text-xs sm:text-sm text-white/80">Tạo hồ sơ</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
