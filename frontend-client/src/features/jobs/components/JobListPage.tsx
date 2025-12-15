import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { JobCard } from './JobCard';
import { useJobs } from '../hooks/useJobs';
import { Loader2, Search, MapPin, DollarSign, Briefcase, SlidersHorizontal } from 'lucide-react';

const jobTypes = [
  { value: '', label: 'Tất cả' },
  { value: 'FULL_TIME', label: 'Toàn thời gian' },
  { value: 'PART_TIME', label: 'Bán thời gian' },
  { value: 'CONTRACT', label: 'Hợp đồng' },
  { value: 'INTERNSHIP', label: 'Thực tập' },
];

const jobLevels = [
  { value: '', label: 'Tất cả' },
  { value: 'INTERN', label: 'Thực tập sinh' },
  { value: 'FRESHER', label: 'Fresher' },
  { value: 'JUNIOR', label: 'Junior' },
  { value: 'MIDDLE', label: 'Middle' },
  { value: 'SENIOR', label: 'Senior' },
  { value: 'LEAD', label: 'Lead/Manager' },
];

const salaryRanges = [
  { value: '', label: 'Tất cả' },
  { value: '0-10', label: 'Dưới 10 triệu' },
  { value: '10-15', label: '10 - 15 triệu' },
  { value: '15-20', label: '15 - 20 triệu' },
  { value: '20-30', label: '20 - 30 triệu' },
  { value: '30-50', label: '30 - 50 triệu' },
  { value: '50-999', label: 'Trên 50 triệu' },
];

export const JobListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [level, setLevel] = useState(searchParams.get('level') || '');
  const [salaryRange, setSalaryRange] = useState(searchParams.get('salary') || '');

  // Parse salary range for API
  const getSalaryParams = () => {
    if (!salaryRange) return {};
    const [min, max] = salaryRange.split('-').map((v) => parseInt(v) * 1000000);
    return { salaryMin: min, salaryMax: max === 999000000 ? undefined : max };
  };

  // Fetch jobs with filters
  const { jobs, total, isLoading, error } = useJobs({
    search: keyword || undefined,
    city: location || undefined,
    jobType: type || undefined,
    jobLevel: level || undefined,
    ...getSalaryParams(),
  });

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (location) params.set('location', location);
    if (type) params.set('type', type);
    if (level) params.set('level', level);
    if (salaryRange) params.set('salary', salaryRange);
    setSearchParams(params);
  }, [keyword, location, type, level, salaryRange, setSearchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search will trigger automatically via useEffect when params change
  };

  const clearFilters = () => {
    setKeyword('');
    setLocation('');
    setType('');
    setLevel('');
    setSalaryRange('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = keyword || location || type || level || salaryRange;

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Main Search */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm theo vị trí, kỹ năng, công ty..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <div className="w-64 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Địa điểm"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <Button type="submit" size="lg" className="px-8">
                  Tìm kiếm
                </Button>
              </div>

              {/* Filter Toggle */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  {showFilters ? 'Ẩn bộ lọc' : 'Hiển thị bộ lọc'}
                </button>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  {/* Job Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Briefcase className="w-4 h-4 inline mr-1" />
                      Hình thức làm việc
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {jobTypes.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Job Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Briefcase className="w-4 h-4 inline mr-1" />
                      Cấp bậc
                    </label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {jobLevels.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Salary Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Mức lương (triệu)
                    </label>
                    <select
                      value={salaryRange}
                      onChange={(e) => setSalaryRange(e.target.value)}
                      className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {salaryRanges.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Results */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {isLoading
                ? 'Đang tìm kiếm...'
                : `Tìm thấy ${total} việc làm${hasActiveFilters ? ' phù hợp' : ''}`}
            </h2>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="py-12 text-center">
                <p className="text-red-600 font-medium mb-2">
                  Có lỗi xảy ra khi tải danh sách việc làm
                </p>
                <p className="text-red-500 text-sm">{error.message}</p>
              </CardContent>
            </Card>
          )}

          {/* Job List */}
          {!isLoading && !error && jobs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && jobs.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Không tìm thấy việc làm phù hợp
                </h3>
                <p className="text-gray-600 mb-4">
                  Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Xóa bộ lọc
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default JobListPage;
