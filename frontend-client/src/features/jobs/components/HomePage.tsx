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

// Mock data - sẽ thay bằng API call sau
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer (ReactJS)',
    description:
      'Chúng tôi đang tìm kiếm một Senior Frontend Developer có kinh nghiệm với ReactJS để tham gia đội ngũ phát triển sản phẩm của chúng tôi.',
    salary: { min: 25000000, max: 35000000 },
    location: 'Hà Nội',
    type: 'FULL_TIME',
    level: 'SENIOR',
    requirements: ['ReactJS', 'TypeScript', 'NextJS'],
    isHot: true,
    isNew: true,
    createdAt: '2025-12-10',
    company: {
      id: '1',
      name: 'FPT Software',
      logo: 'https://via.placeholder.com/64',
      address: 'Hà Nội',
    },
  },
  {
    id: '2',
    title: 'Backend Developer (NodeJS)',
    description: 'Tìm kiếm Backend Developer có kinh nghiệm phát triển API với NodeJS và Express.',
    salary: { min: 20000000, max: 30000000 },
    location: 'Hồ Chí Minh',
    type: 'FULL_TIME',
    level: 'MIDDLE',
    requirements: ['NodeJS', 'Express', 'MongoDB'],
    isNew: true,
    createdAt: '2025-12-09',
    company: {
      id: '2',
      name: 'VNG Corporation',
      logo: 'https://via.placeholder.com/64',
      address: 'TP.HCM',
    },
  },
  {
    id: '3',
    title: 'Full-stack Developer',
    description: 'Vị trí Full-stack Developer cho dự án phát triển ứng dụng web hiện đại.',
    salary: { min: 18000000, max: 28000000 },
    location: 'Đà Nẵng',
    type: 'FULL_TIME',
    level: 'JUNIOR',
    requirements: ['JavaScript', 'React', 'NodeJS'],
    isHot: true,
    createdAt: '2025-12-08',
    company: {
      id: '3',
      name: 'Teko Vietnam',
      logo: 'https://via.placeholder.com/64',
      address: 'Đà Nẵng',
    },
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    description: 'Tìm kiếm DevOps Engineer có kinh nghiệm về CI/CD, Docker, Kubernetes.',
    salary: { min: 30000000, max: 45000000 },
    location: 'Hà Nội',
    type: 'FULL_TIME',
    level: 'SENIOR',
    requirements: ['Docker', 'Kubernetes', 'AWS'],
    isHot: true,
    createdAt: '2025-12-10',
    company: {
      id: '4',
      name: 'VinTech',
      logo: 'https://via.placeholder.com/64',
      address: 'Hà Nội',
    },
  },
  {
    id: '5',
    title: 'Mobile Developer (React Native)',
    description: 'Phát triển ứng dụng mobile đa nền tảng với React Native.',
    salary: { min: 22000000, max: 32000000 },
    location: 'Hồ Chí Minh',
    type: 'FULL_TIME',
    level: 'MIDDLE',
    requirements: ['React Native', 'TypeScript', 'Redux'],
    isNew: true,
    createdAt: '2025-12-09',
    company: {
      id: '5',
      name: 'Shopee Vietnam',
      logo: 'https://via.placeholder.com/64',
      address: 'TP.HCM',
    },
  },
  {
    id: '6',
    title: 'Thực tập sinh Frontend',
    description: 'Cơ hội thực tập và học hỏi kinh nghiệm phát triển frontend từ đội ngũ senior.',
    salary: { min: 5000000, max: 8000000 },
    location: 'Hà Nội',
    type: 'INTERNSHIP',
    level: 'INTERN',
    requirements: ['HTML', 'CSS', 'JavaScript', 'React cơ bản'],
    isNew: true,
    createdAt: '2025-12-10',
    company: {
      id: '6',
      name: 'Tech Startup Hub',
      logo: 'https://via.placeholder.com/64',
      address: 'Hà Nội',
    },
  },
];

export const HomePage = () => {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'hot' | 'new'>('all');

  const handleSearch = (keyword: string, location: string) => {
    console.log('Searching:', keyword, location);
    // TODO: Implement API call
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === 'hot') return job.isHot;
    if (activeTab === 'new') return job.isNew;
    return true;
  });

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
