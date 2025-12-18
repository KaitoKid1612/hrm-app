import { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { HeroSection } from './HeroSection';
import { SearchBar } from './SearchBar';
import { CategorySection } from './CategorySection';
import { JobTabs } from './JobTabs';
import { JobListSection } from './JobListSection';
import { TopCompaniesSection } from './TopCompaniesSection';
import { CTASection } from './CTASection';
import { Job } from '../types';
import { useJobs } from '../hooks/useJobs';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const HomePage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'hot' | 'new'>('all');
  const [searchParams, setSearchParams] = useState<{ keyword?: string; city?: string }>({});
  const [page, setPage] = useState(1);

  // Fetch jobs based on active tab
  const {
    jobs: allJobs,
    total: totalAll,
    totalPages: totalPagesAll,
    isLoading: isLoadingAll,
  } = useJobs({
    page,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...searchParams,
  });

  const {
    jobs: hotJobs,
    total: totalHot,
    totalPages: totalPagesHot,
    isLoading: isLoadingHot,
  } = useJobs({
    page,
    limit: 12,
    isHot: true,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...searchParams,
  });

  // Determine which jobs to display based on active tab
  let jobs = allJobs;
  let isLoading = isLoadingAll;
  let total = totalAll;
  let totalPages = totalPagesAll;

  if (activeTab === 'hot') {
    jobs = hotJobs;
    isLoading = isLoadingHot;
    total = totalHot;
    totalPages = totalPagesHot;
  }

  // Filter jobs by tab
  const filteredJobs = jobs.filter((job: Job) => {
    if (activeTab === 'new')
      return job.isNew || new Date(job.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days
    return true;
  });

  // Reset page when tab changes
  const handleTabChange = (tab: 'all' | 'hot' | 'new') => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleSearch = async (keyword: string, location: string) => {
    setSearchParams({ keyword: keyword || undefined, city: location || undefined });
    setPage(1);
  };

  return (
    <MainLayout>
      {/* Hero Section with Stats */}
      <HeroSection />

      {/* Search Section */}
      <SearchBar onSearch={handleSearch} />

      {/* Categories Section */}
      <CategorySection />

      {/* Job Listings Section */}
      <section className="py-12 sm:py-16 bg-linear-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Việc Làm Nổi Bật
            </h2>
            <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
              Khám phá hàng nghìn cơ hội việc làm hấp dẫn từ các công ty hàng đầu
            </p>
          </div>

          {/* Job Tabs */}
          <JobTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            jobCount={filteredJobs.length}
          />

          {/* Job List */}
          <JobListSection jobs={filteredJobs} isLoading={isLoading} />

          {/* Pagination */}
          {totalPages > 1 && !isLoading && (
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="text-sm text-gray-600 text-center sm:text-left">
                Hiển thị <span className="font-semibold text-gray-900">{(page - 1) * 12 + 1}</span>{' '}
                - <span className="font-semibold text-gray-900">{Math.min(page * 12, total)}</span>{' '}
                trong tổng số <span className="font-semibold text-blue-600">{total}</span> việc làm
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  disabled={page === 1}
                  className="flex items-center gap-1 h-10"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Trước</span>
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setPage(pageNum);
                          window.scrollTo({ top: 400, behavior: 'smooth' });
                        }}
                        className={`w-10 h-10 p-0 ${
                          page === pageNum
                            ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                            : ''
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  disabled={page >= totalPages}
                  className="flex items-center gap-1 h-10"
                >
                  <span className="hidden sm:inline">Sau</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Top Companies Section */}
      <TopCompaniesSection />

      {/* CTA Section */}
      <CTASection />
    </MainLayout>
  );
};

export default HomePage;
