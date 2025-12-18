import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { companyService, Company } from '../services/companyService';
import {
  Building2,
  Search,
  MapPin,
  Briefcase,
  Users,
  Globe,
  ArrowRight,
  Filter,
} from 'lucide-react';

const companySizes = [
  { value: '', label: 'Tất cả quy mô' },
  { value: '1-50', label: '1-50 nhân viên' },
  { value: '51-200', label: '51-200 nhân viên' },
  { value: '201-500', label: '201-500 nhân viên' },
  { value: '500+', label: 'Trên 500 nhân viên' },
];

export const CompanyListPage = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [companies, searchKeyword, cityFilter, sizeFilter]);

  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      const data = await companyService.getCompanies();
      setCompanies(data);
      setFilteredCompanies(data);
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCompanies = () => {
    let filtered = [...companies];

    // Search by keyword
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(
        (company) =>
          company.name.toLowerCase().includes(keyword) ||
          company.description?.toLowerCase().includes(keyword),
      );
    }

    // Filter by city
    if (cityFilter) {
      filtered = filtered.filter((company) => company.city === cityFilter);
    }

    // Filter by size
    if (sizeFilter) {
      filtered = filtered.filter((company) => company.size === sizeFilter);
    }

    setFilteredCompanies(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterCompanies();
  };

  const clearFilters = () => {
    setSearchKeyword('');
    setCityFilter('');
    setSizeFilter('');
  };

  // Get unique cities for filter
  const cities = Array.from(new Set(companies.map((c) => c.city).filter(Boolean))) as string[];

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải danh sách công ty...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-linear-to-br from-blue-600 to-indigo-700 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Khám Phá Các Công Ty Hàng Đầu</h1>
            <p className="text-lg text-white/90">
              Tìm hiểu về các doanh nghiệp và cơ hội việc làm tuyệt vời
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-2 flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm công ty..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="flex-1 outline-none text-gray-900"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="shrink-0 text-blue-500 bg-white hover:bg-gray-100"
              >
                Tìm kiếm
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters & Results Count */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{filteredCompanies.length} công ty</h2>
            <p className="text-gray-600">
              {searchKeyword || cityFilter || sizeFilter
                ? 'Kết quả phù hợp với bộ lọc'
                : 'Tất cả các công ty'}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full sm:w-auto"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* City Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thành phố</label>
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tất cả thành phố</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Size Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quy mô công ty
                  </label>
                  <select
                    value={sizeFilter}
                    onChange={(e) => setSizeFilter(e.target.value)}
                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {companySizes.map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    Xóa bộ lọc
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Companies Grid */}
        {filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <Card
                key={company.id}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                onClick={() => navigate(`/companies/${company.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    {/* Company Logo */}
                    <div className="w-16 h-16 rounded-xl border border-gray-200 flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-50 shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-full h-full object-contain rounded-xl"
                        />
                      ) : (
                        <Building2 className="w-8 h-8 text-blue-400" />
                      )}
                    </div>

                    {/* Company Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
                        {company.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {company.city && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{company.city}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {company.description || 'Công ty hàng đầu trong lĩnh vực của mình'}
                  </p>

                  {/* Company Details */}
                  <div className="space-y-2 mb-4">
                    {company.size && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{company.size} nhân viên</span>
                      </div>
                    )}
                    {company.industry && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        <span>{company.industry}</span>
                      </div>
                    )}
                    {company.website && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Globe className="w-4 h-4" />
                        <span className="truncate">{company.website}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600">
                      <Briefcase className="w-4 h-4 inline mr-1" />
                      {company.jobCount || 0} việc làm
                    </div>
                    <div className="flex items-center gap-1 text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
                      Xem chi tiết
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Không tìm thấy công ty nào
              </h3>
              <p className="text-gray-600 mb-4">Vui lòng thử điều chỉnh bộ lọc của bạn</p>
              <Button onClick={clearFilters} variant="outline">
                Xóa bộ lọc
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default CompanyListPage;
