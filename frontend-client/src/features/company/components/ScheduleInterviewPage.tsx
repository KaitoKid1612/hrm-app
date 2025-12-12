import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useInterviews } from '../hooks/useInterviews';
import { CreateInterviewData } from '../types/interview.types';
import { Calendar, Clock, MapPin, Video, Users, FileText, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/constants';

interface ScheduleInterviewPageProps {
  applicationId?: string;
}

export const ScheduleInterviewPage = ({ applicationId: propAppId }: ScheduleInterviewPageProps) => {
  const navigate = useNavigate();
  const { createInterview } = useInterviews();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateInterviewData>({
    applicationId: propAppId || '',
    scheduledAt: '',
    duration: 60,
    location: '',
    meetingLink: '',
    interviewers: '',
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) || 60 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.applicationId) {
      setError('Application ID is required');
      return;
    }

    if (!formData.scheduledAt) {
      setError('Interview date and time is required');
      return;
    }

    try {
      setIsSubmitting(true);
      await createInterview(formData);
      navigate(ROUTES.COMPANY_INTERVIEWS);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to schedule interview');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Schedule Interview</h1>
        <p className="text-gray-600 mt-2">Set up an interview with the candidate</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Interview Details</h2>

          <div className="space-y-6">
            {/* Application ID */}
            {!propAppId && (
              <div>
                <Label htmlFor="applicationId" className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4" />
                  Application ID *
                </Label>
                <Input
                  id="applicationId"
                  name="applicationId"
                  value={formData.applicationId}
                  onChange={handleChange}
                  required
                  placeholder="Enter application ID"
                />
              </div>
            )}

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="scheduledAt" className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  Interview Date & Time *
                </Label>
                <Input
                  id="scheduledAt"
                  name="scheduledAt"
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="duration" className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4" />
                  Duration (minutes)
                </Label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4" />
                Location (Optional)
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Office - Room 301"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty if interview is online only</p>
            </div>

            {/* Meeting Link */}
            <div>
              <Label htmlFor="meetingLink" className="flex items-center gap-2 mb-2">
                <Video className="w-4 h-4" />
                Meeting Link (Optional)
              </Label>
              <Input
                id="meetingLink"
                name="meetingLink"
                type="url"
                value={formData.meetingLink}
                onChange={handleChange}
                placeholder="https://meet.google.com/..."
              />
            </div>

            {/* Interviewers */}
            <div>
              <Label htmlFor="interviewers" className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4" />
                Interviewers (Optional)
              </Label>
              <Input
                id="interviewers"
                name="interviewers"
                value={formData.interviewers}
                onChange={handleChange}
                placeholder="e.g., John Doe, Jane Smith"
              />
              <p className="text-xs text-gray-500 mt-1">Comma-separated names</p>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes" className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4" />
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Additional notes about the interview..."
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-blue-500 hover:bg-blue-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Scheduling...' : 'Schedule Interview'}
          </Button>
        </div>
      </form>
    </div>
  );
};
