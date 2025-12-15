import { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { HeroSection } from './HeroSection';
import { SearchBar } from './SearchBar';
import { CategorySection } from './CategorySection';
import { JobTabs } from './JobTabs';
import { JobListSection } from './JobListSection';
import { TopCompaniesSection } from './TopCompaniesSection';
import { CTASection } from './CTASection';
import { Job } from '../types';
import { useJobs, useTrendingJobs } from '../hooks/useJobs';

export const HomePage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'hot' | 'new'>('all');
  const [searchParams, setSearchParams] = useState<{ keyword?: string; city?: string }>({});

  // Fetch jobs based on active tab
  const { jobs: allJobs, isLoading: isLoadingAll } = useJobs({
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...searchParams,
  });

  const { jobs: trendingJobs, isLoading: isLoadingTrending } = useTrendingJobs(12);

  // Determine which jobs to display based on active tab
  const jobs = activeTab === 'hot' ? trendingJobs : allJobs;
  const isLoading = activeTab === 'hot' ? isLoadingTrending : isLoadingAll;

  // Filter jobs by tab
  const filteredJobs = jobs.filter((job: Job) => {
    if (activeTab === 'hot') return job.isHot || true; // Trending API already returns hot jobs
    if (activeTab === 'new')
      return job.isNew || new Date(job.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days
    return true;
  });

  const handleSearch = async (keyword: string, location: string) => {
    setSearchParams({ keyword: keyword || undefined, city: location || undefined });
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
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
              Việc Làm Nổi Bật
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Khám phá những cơ hội việc làm tốt nhất dành cho bạn
            </p>
          </div>

          {/* Job Tabs */}
          <JobTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            jobCount={filteredJobs.length}
          />

          {/* Job List */}
          <JobListSection jobs={filteredJobs} isLoading={isLoading} />
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
