import { Card, CardContent } from '@/components/ui/card';
import { Building2, MapPin, Briefcase } from 'lucide-react';
import { useTopCompanies } from '../hooks/useCompanies';
import { getImageUrl } from '@/lib/image-utils';

export const TopCompaniesSection = () => {
  const { companies, isLoading } = useTopCompanies(6);

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
          {isLoading
            ? // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="border-gray-200">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-200 animate-pulse shrink-0"></div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            : companies.map((company) => (
                <Card
                  key={company.id}
                  className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-gray-200 group"
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-gray-200 flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-50 shrink-0 group-hover:scale-110 transition-transform duration-300">
                        {company.logo ? (
                          <img
                            src={getImageUrl(company.logo)}
                            alt={company.name}
                            className="w-full h-full object-contain rounded-xl"
                          />
                        ) : (
                          <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
                          {company.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                          {company.description || 'Công ty công nghệ hàng đầu'}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                            <span className="truncate">{company.city || 'Việt Nam'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                            <span className="font-medium text-blue-600">
                              {company.jobCount || 0} việc làm
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
