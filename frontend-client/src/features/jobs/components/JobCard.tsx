import { Job } from '../types';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  TrendingUp,
  Sparkles,
  Building2,
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';

interface JobCardProps {
  job: Job;
}

export const JobCard = ({ job }: JobCardProps) => {
  const formatSalary = (min: number, max: number) => {
    if (min === max) return `${(min / 1000000).toFixed(0)}M`;
    return `${(min / 1000000).toFixed(0)}M - ${(max / 1000000).toFixed(0)}M`;
  };

  const getJobTypeLabel = (type: string) => {
    const labels = {
      FULL_TIME: 'Full-time',
      PART_TIME: 'Part-time',
      CONTRACT: 'Hợp đồng',
      INTERNSHIP: 'Thực tập',
      FREELANCE: 'Freelance',
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <Card className="group hover:shadow-2xl hover:border-blue-200 transition-all duration-300 cursor-pointer overflow-hidden border-gray-200">
      <Link to={ROUTES.JOB_DETAIL.replace(':id', job.id)} className="block">
        <CardContent className="p-6">
          {/* Header with Logo and Badges */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-3">
              {/* Company Logo */}
              <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-linear-to-br from-blue-50 to-indigo-50 group-hover:scale-110 transition-transform duration-300">
                {job.company.logo ? (
                  <img
                    src={job.company.logo}
                    alt={job.company.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-blue-400">
                    <Building2 className="w-7 h-7" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-600 font-medium">{job.company.name}</p>
              </div>
            </div>

            {/* Badges */}
            {(job.isHot || job.isNew) && (
              <div className="flex flex-col gap-1">
                {job.isHot && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-linear-to-r from-red-500 to-orange-500 text-white shadow-lg">
                    <TrendingUp className="w-3 h-3" />
                    HOT
                  </span>
                )}
                {job.isNew && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-linear-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    MỚI
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Job Details */}
          <div className="space-y-3 mb-4">
            {/* Salary - Highlighted */}
            <div className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2 border border-green-200">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-bold text-green-700 text-base">
                {formatSalary(job.salary.min, job.salary.max)} VNĐ
              </span>
            </div>

            {/* Location & Type */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="font-medium">{job.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 text-purple-500" />
                <span className="font-medium">{getJobTypeLabel(job.type)}</span>
              </div>
            </div>

            {/* Skills */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {job.requirements.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100"
                  >
                    {skill}
                  </span>
                ))}
                {job.requirements.length > 3 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    +{job.requirements.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100 group-hover:bg-blue-50 transition-colors">
          <Button
            variant="ghost"
            className="w-full font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-100"
          >
            Xem chi tiết
            <Briefcase className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
};
