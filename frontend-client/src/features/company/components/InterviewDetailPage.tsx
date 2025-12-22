import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { interviewService } from '../services/interviewService';
import { Interview, InterviewStatus } from '../types/interview.types';
import { getImageUrl } from '@/lib/image-utils';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  FileText,
  Mail,
  Phone,
  ArrowLeft,
  Edit,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { ROUTES } from '@/constants';
import { format, parseISO } from 'date-fns';

const STATUS_OPTIONS = [
  { value: InterviewStatus.SCHEDULED, label: 'Scheduled' },
  { value: InterviewStatus.CONFIRMED, label: 'Confirmed' },
  { value: InterviewStatus.COMPLETED, label: 'Completed' },
  { value: InterviewStatus.CANCELLED, label: 'Cancelled' },
  { value: InterviewStatus.RESCHEDULED, label: 'Rescheduled' },
  { value: InterviewStatus.NO_SHOW, label: 'No Show' },
];

export const InterviewDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<InterviewStatus>(InterviewStatus.SCHEDULED);

  useEffect(() => {
    if (id) {
      fetchInterview();
    }
  }, [id]);

  const fetchInterview = async () => {
    try {
      setIsLoading(true);
      const data = await interviewService.getById(id!);
      setInterview(data);
      setSelectedStatus(data.status);
      setFeedback(data.feedback || '');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to fetch interview');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      setIsUpdating(true);
      setError(null);
      const updated = await interviewService.update(id!, {
        status: selectedStatus,
        feedback: feedback || undefined,
      });
      setInterview(updated);
      setEditMode(false);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to update interview');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 mt-4">Loading interview details...</p>
      </div>
    );
  }

  if (error && !interview) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
          <Button onClick={() => navigate(ROUTES.COMPANY_INTERVIEWS)} className="mt-4">
            Back to Interviews
          </Button>
        </div>
      </div>
    );
  }

  if (!interview) {
    return null;
  }

  const scheduledDate = parseISO(interview.scheduledAt);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(ROUTES.COMPANY_INTERVIEWS)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Interviews
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Interview Details</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Candidate Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Candidate Information</h2>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
            {interview.application.user.avatar ? (
              <img
                src={getImageUrl(interview.application.user.avatar)}
                alt={interview.application.user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-semibold text-blue-600">
                {interview.application.user.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">
              {interview.application.user.name}
            </h3>
            {interview.application.user.currentJobTitle && (
              <p className="text-gray-600">{interview.application.user.currentJobTitle}</p>
            )}
            <div className="flex flex-wrap gap-4 mt-3">
              <a
                href={`mailto:${interview.application.user.email}`}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600"
              >
                <Mail className="w-4 h-4" />
                {interview.application.user.email}
              </a>
              {interview.application.user.phone && (
                <a
                  href={`tel:${interview.application.user.phone}`}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600"
                >
                  <Phone className="w-4 h-4" />
                  {interview.application.user.phone}
                </a>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Applying for: <span className="font-medium">{interview.application.job.title}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Interview Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Interview Schedule</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-medium text-gray-900">{format(scheduledDate, 'MMMM d, yyyy')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Time</p>
              <p className="font-medium text-gray-900">
                {format(scheduledDate, 'h:mm a')} ({interview.duration} min)
              </p>
            </div>
          </div>
          {interview.location && (
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium text-gray-900">{interview.location}</p>
              </div>
            </div>
          )}
          {interview.meetingLink && (
            <div className="flex items-center gap-3">
              <Video className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Meeting Link</p>
                <a
                  href={interview.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Join Meeting
                </a>
              </div>
            </div>
          )}
          {interview.interviewers && (
            <div className="flex items-center gap-3 md:col-span-2">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Interviewers</p>
                <p className="font-medium text-gray-900">{interview.interviewers}</p>
              </div>
            </div>
          )}
        </div>
        {interview.notes && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Notes</p>
                <p className="text-gray-900 bg-gray-50 rounded-lg p-3">{interview.notes}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status and Feedback */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Status & Feedback</h2>
          {!editMode && (
            <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        {editMode ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Interview Status</Label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as InterviewStatus)}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="feedback">Feedback (Optional)</Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={6}
                placeholder="Add your feedback about the interview..."
                className="mt-2"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleUpdateStatus}
                disabled={isUpdating}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditMode(false);
                  setSelectedStatus(interview.status);
                  setFeedback(interview.feedback || '');
                }}
                disabled={isUpdating}
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Current Status</p>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-600">
                {STATUS_OPTIONS.find((opt) => opt.value === interview.status)?.label}
              </span>
            </div>
            {interview.feedback && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Feedback</p>
                <p className="text-gray-900 bg-gray-50 rounded-lg p-4 whitespace-pre-wrap">
                  {interview.feedback}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
