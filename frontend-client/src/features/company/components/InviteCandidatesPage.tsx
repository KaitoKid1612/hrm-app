import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { jobManagementService, Job } from '../services/jobManagementService';
import { inviteService, InviteCandidate } from '../services/inviteService';
import { toast } from '@/lib/toast';
import { ROUTES } from '@/constants';
import { BulkInviteForm } from './invites/BulkInviteForm';
import { CSVUploadForm } from './invites/CSVUploadForm';
import { InvitesList } from './invites/InvitesList';
import { InviteStatsCard } from './invites/InviteStatsCard';
import { Mail, Upload, UserPlus, Briefcase } from 'lucide-react';

type InviteMethod = 'manual' | 'csv';

export const InviteCandidatesPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobIdFromUrl = searchParams.get('jobId');

  const [jobs, setJobs] = useState<Array<{ id: string; title: string }>>([]);
  const [selectedJobId, setSelectedJobId] = useState(jobIdFromUrl || '');
  const [inviteMethod, setInviteMethod] = useState<InviteMethod>('manual');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Manual invite state
  const [candidates, setCandidates] = useState<InviteCandidate[]>([]);
  const [currentCandidate, setCurrentCandidate] = useState<InviteCandidate>({
    email: '',
    name: '',
    phone: '',
    note: '',
  });
  const [customMessage, setCustomMessage] = useState('');

  // CSV upload state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<InviteCandidate[]>([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      const response = await jobManagementService.getMyJobs();
      const jobsData = response.data || [];
      setJobs(jobsData.map((job: Job) => ({ id: job.id, title: job.title })));
    } catch (error) {
      toast.error('Không thể tải danh sách công việc');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCandidate = () => {
    if (!currentCandidate.email || !currentCandidate.name) {
      toast.error('Vui lòng nhập email và tên ứng viên');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(currentCandidate.email)) {
      toast.error('Email không hợp lệ');
      return;
    }

    // Check duplicate
    if (candidates.some((c) => c.email === currentCandidate.email)) {
      toast.error('Email này đã tồn tại trong danh sách');
      return;
    }

    setCandidates([...candidates, currentCandidate]);
    setCurrentCandidate({ email: '', name: '', phone: '', note: '' });
    toast.success('Đã thêm ứng viên');
  };

  const handleRemoveCandidate = (email: string) => {
    setCandidates(candidates.filter((c) => c.email !== email));
  };

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      toast.error('Vui lòng chọn file CSV');
      return;
    }

    setCsvFile(file);

    // Preview CSV (basic parsing)
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const preview: InviteCandidate[] = [];

      // Skip header and parse lines
      for (let i = 1; i < Math.min(lines.length, 6); i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [email, name, phone, note] = line.split(',').map((s) => s.trim());
        if (email && name) {
          preview.push({ email, name, phone, note });
        }
      }

      setCsvPreview(preview);
    };
    reader.readAsText(file);
  };

  const handleSendInvites = async () => {
    if (!selectedJobId) {
      toast.error('Vui lòng chọn công việc');
      return;
    }

    if (inviteMethod === 'manual' && candidates.length === 0) {
      toast.error('Vui lòng thêm ít nhất một ứng viên');
      return;
    }

    if (inviteMethod === 'csv' && !csvFile) {
      toast.error('Vui lòng chọn file CSV');
      return;
    }

    try {
      setIsSending(true);
      let result;

      if (inviteMethod === 'manual') {
        result = await inviteService.bulkInvite({
          jobId: selectedJobId,
          candidates,
          customMessage: customMessage || undefined,
        });
      } else {
        result = await inviteService.uploadCsvInvite(selectedJobId, csvFile!);
      }

      // Show result
      if (result.failed === 0) {
        toast.success(`Đã gửi lời mời thành công đến ${result.sent} ứng viên!`);
        // Reset form
        setCandidates([]);
        setCsvFile(null);
        setCsvPreview([]);
        setCustomMessage('');
      } else {
        toast.warning(`Đã gửi ${result.sent}/${result.total} lời mời. ${result.failed} thất bại.`);
        console.error('Failed invites:', result.errors);
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi gửi lời mời');
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const downloadCsvTemplate = () => {
    const csvContent =
      'email,name,phone,note\ncandidate@example.com,Nguyen Van A,0901234567,Ứng viên tiềm năng\ncandidate2@example.com,Tran Thi B,0909876543,Senior Developer';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invite-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-blue-600" />
            Mời ứng viên
          </h1>
          <p className="text-gray-600 mt-1">Gửi lời mời ứng tuyển đến các ứng viên tiềm năng</p>
        </div>
        <Button variant="outline" onClick={() => navigate(ROUTES.MANAGE_JOBS)}>
          Quay lại
        </Button>
      </div>

      {/* Job Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Chọn công việc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="job">Công việc cần tuyển</Label>
          <select
            id="job"
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            disabled={isLoading}
          >
            <option value="">-- Chọn công việc --</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Invite Method Tabs */}
      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <button
              onClick={() => setInviteMethod('manual')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                inviteMethod === 'manual'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Nhập thủ công
            </button>
            <button
              onClick={() => setInviteMethod('csv')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                inviteMethod === 'csv'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Tải lên CSV
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {inviteMethod === 'manual' ? (
            <div className="space-y-6">
              <BulkInviteForm
                currentCandidate={currentCandidate}
                customMessage={customMessage}
                onCandidateChange={setCurrentCandidate}
                onCustomMessageChange={setCustomMessage}
                onAddCandidate={handleAddCandidate}
              />
              <InvitesList candidates={candidates} onRemove={handleRemoveCandidate} />
            </div>
          ) : (
            <CSVUploadForm
              csvFile={csvFile}
              csvPreview={csvPreview}
              onFileChange={handleCsvFileChange}
              onDownloadTemplate={downloadCsvTemplate}
            />
          )}
        </CardContent>
      </Card>

      {/* Send Button */}
      <InviteStatsCard
        candidateCount={inviteMethod === 'manual' ? candidates.length : csvPreview.length}
        isSending={isSending}
        isDisabled={
          !selectedJobId ||
          isSending ||
          (inviteMethod === 'manual' && candidates.length === 0) ||
          (inviteMethod === 'csv' && !csvFile)
        }
        onSend={handleSendInvites}
      />
    </div>
  );
};

export default InviteCandidatesPage;
