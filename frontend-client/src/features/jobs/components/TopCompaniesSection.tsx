import { Card, CardContent } from '@/components/ui/card';
import { Building2, MapPin, Briefcase } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  logo: string;
  location: string;
  jobCount: number;
  description: string;
}

const topCompanies: Company[] = [
  {
    id: '1',
    name: 'FPT Software',
    logo: 'https://via.placeholder.com/80',
    location: 'Hà Nội',
    jobCount: 156,
    description: 'Công ty phần mềm hàng đầu Việt Nam',
  },
  {
    id: '2',
    name: 'VNG Corporation',
    logo: 'https://via.placeholder.com/80',
    location: 'TP. Hồ Chí Minh',
    jobCount: 89,
    description: 'Tập đoàn công nghệ số hàng đầu',
  },
  {
    id: '3',
    name: 'Shopee Vietnam',
    logo: 'https://via.placeholder.com/80',
    location: 'TP. Hồ Chí Minh',
    jobCount: 124,
    description: 'Nền tảng thương mại điện tử',
  },
  {
    id: '4',
    name: 'Tiki Corporation',
    logo: 'https://via.placeholder.com/80',
    location: 'TP. Hồ Chí Minh',
    jobCount: 67,
    description: 'Công ty thương mại điện tử Việt Nam',
  },
  {
    id: '5',
    name: 'MOMO',
    logo: 'https://via.placeholder.com/80',
    location: 'Hà Nội',
    jobCount: 92,
    description: 'Ví điện tử số 1 Việt Nam',
  },
  {
    id: '6',
    name: 'Viettel Digital',
    logo: 'https://via.placeholder.com/80',
    location: 'Hà Nội',
    jobCount: 178,
    description: 'Tập đoàn viễn thông và công nghệ',
  },
];

export const TopCompaniesSection = () => {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
            Công Ty Hàng Đầu
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Khám phá cơ hội nghề nghiệp tại các công ty lớn nhất
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {topCompanies.map((company) => (
            <Card
              key={company.id}
              className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-gray-200 group"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-gray-200 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
                      {company.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                      {company.description}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                        <span className="truncate">{company.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                        <span className="font-medium text-blue-600">
                          {company.jobCount} việc làm
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-blue-600 font-medium rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all hover:scale-105 shadow-md">
            Xem tất cả công ty
          </button>
        </div>
      </div>
    </section>
  );
};
