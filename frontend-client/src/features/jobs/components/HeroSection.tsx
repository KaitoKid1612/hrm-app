import { Briefcase, Users, Building2, TrendingUp } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  count: string;
  label: string;
}

const StatCard = ({ icon, count, label }: StatCardProps) => (
  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
    <div className="text-white shrink-0">{icon}</div>
    <div>
      <div className="text-xl sm:text-2xl font-bold text-white">{count}</div>
      <div className="text-xs sm:text-sm text-white/80">{label}</div>
    </div>
  </div>
);

export const HeroSection = () => {
  return (
    <div className="bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center lg:text-left">
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight">
            Tìm Việc Làm <span className="text-yellow-300">IT</span> Phù Hợp
            <br className="hidden sm:block" />
            Với Bạn
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-8 lg:mb-12 max-w-2xl mx-auto lg:mx-0">
            Hàng nghìn cơ hội việc làm IT đang chờ đón bạn từ các công ty hàng đầu
          </p>

          {/* Stats - Responsive Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              icon={<Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />}
              count="10K+"
              label="Việc làm"
            />
            <StatCard
              icon={<Building2 className="w-5 h-5 sm:w-6 sm:h-6" />}
              count="5K+"
              label="Công ty"
            />
            <StatCard
              icon={<Users className="w-5 h-5 sm:w-6 sm:h-6" />}
              count="50K+"
              label="Ứng viên"
            />
            <StatCard
              icon={<TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />}
              count="15K+"
              label="Tuyển dụng"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
