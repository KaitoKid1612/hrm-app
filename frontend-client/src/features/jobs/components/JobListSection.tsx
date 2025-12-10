import { Job } from '../types';
import { JobCard } from './JobCard';
import { Loader2, Search } from 'lucide-react';

interface JobListSectionProps {
  jobs: Job[];
  isLoading: boolean;
}

export const JobListSection = ({ jobs, isLoading }: JobListSectionProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Đang tải công việc...</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Search className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy công việc</h3>
        <p className="text-gray-600">Thử điều chỉnh bộ lọc hoặc tìm kiếm khác</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};
