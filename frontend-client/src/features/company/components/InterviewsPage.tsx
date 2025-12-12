import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useInterviews } from '../hooks/useInterviews';
import { InterviewStatus } from '../types/interview.types';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Filter,
  MoreVertical,
} from 'lucide-react';
import { ROUTES } from '@/constants';
import { format, parseISO, isToday, isTomorrow, isPast } from 'date-fns';

const STATUS_CONFIG = {
  SCHEDULED: {
    label: 'Scheduled',
    icon: Calendar,
    color: 'text-blue-600 bg-blue-100',
  },
  CONFIRMED: {
    label: 'Confirmed',
    icon: CheckCircle,
    color: 'text-green-600 bg-green-100',
  },
  COMPLETED: {
    label: 'Completed',
    icon: CheckCircle,
    color: 'text-gray-600 bg-gray-100',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: XCircle,
    color: 'text-red-600 bg-red-100',
  },
  RESCHEDULED: {
    label: 'Rescheduled',
    icon: AlertCircle,
    color: 'text-yellow-600 bg-yellow-100',
  },
  NO_SHOW: {
    label: 'No Show',
    icon: XCircle,
    color: 'text-orange-600 bg-orange-100',
  },
};

export const InterviewsPage = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<InterviewStatus | 'ALL'>('ALL');
  const { interviews, isLoading, deleteInterview } = useInterviews();

  const filteredInterviews =
    statusFilter === 'ALL'
      ? interviews
      : interviews.filter((interview) => interview.status === statusFilter);

  const getDateLabel = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isPast(date)) return 'Past';
    return format(date, 'MMM d, yyyy');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this interview?')) {
      try {
        await deleteInterview(id);
      } catch (error) {
        console.error('Failed to delete interview:', error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interviews</h1>
          <p className="text-gray-600 mt-1">Manage your scheduled interviews</p>
        </div>
        <Button
          onClick={() => navigate(ROUTES.COMPANY_SCHEDULE_INTERVIEW)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Schedule Interview
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700">Filter by status:</span>
          <div className="flex gap-2 ml-4">
            <Button
              variant={statusFilter === 'ALL' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('ALL')}
            >
              All
            </Button>
            {Object.entries(STATUS_CONFIG).map(([status, config]) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status as InterviewStatus)}
              >
                {config.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading interviews...</p>
        </div>
      ) : filteredInterviews.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No interviews scheduled</h3>
          <p className="text-gray-600 mb-6">
            {statusFilter === 'ALL'
              ? 'Start scheduling interviews with your candidates'
              : `No ${STATUS_CONFIG[statusFilter as InterviewStatus].label.toLowerCase()} interviews`}
          </p>
          <Button onClick={() => navigate(ROUTES.COMPANY_SCHEDULE_INTERVIEW)}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Your First Interview
          </Button>
        </div>
      ) : (
        /* Interview List */
        <div className="space-y-4">
          {filteredInterviews.map((interview) => {
            const StatusIcon = STATUS_CONFIG[interview.status].icon;
            const scheduledDate = parseISO(interview.scheduledAt);

            return (
              <div
                key={interview.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Candidate Info */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        {interview.application.user.avatar ? (
                          <img
                            src={interview.application.user.avatar}
                            alt={interview.application.user.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-semibold text-blue-600">
                            {interview.application.user.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {interview.application.user.name}
                        </h3>
                        <p className="text-sm text-gray-600">{interview.application.job.title}</p>
                      </div>
                    </div>

                    {/* Interview Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {format(scheduledDate, 'MMM d, yyyy')} at{' '}
                          {format(scheduledDate, 'h:mm a')}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({getDateLabel(interview.scheduledAt)})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{interview.duration} minutes</span>
                      </div>
                      {interview.location && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{interview.location}</span>
                        </div>
                      )}
                      {interview.meetingLink && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Video className="w-4 h-4 text-gray-400" />
                          <a
                            href={interview.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Join Meeting
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    {interview.notes && (
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                        {interview.notes}
                      </p>
                    )}
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col items-end gap-3 ml-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                        STATUS_CONFIG[interview.status].color
                      }`}
                    >
                      <StatusIcon className="w-4 h-4" />
                      {STATUS_CONFIG[interview.status].label}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`${ROUTES.COMPANY_INTERVIEWS}/${interview.id}`)}
                      >
                        View Details
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(interview.id)}>
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
