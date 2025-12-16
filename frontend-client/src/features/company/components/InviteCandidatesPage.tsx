import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { jobManagementService, Job } from '../services/jobManagementService';
import { inviteService, InviteCandidate } from '../services/inviteService';
import { toast } from '@/lib/toast';
import { ROUTES } from '@/constants';
import {
  Mail,
  Upload,
  UserPlus,
  Send,
  Download,
  X,
  Plus,
  Briefcase,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

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
              {/* Add Candidate Form */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-gray-900">Thêm ứng viên</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="candidate@example.com"
                      value={currentCandidate.email}
                      onChange={(e) =>
                        setCurrentCandidate({ ...currentCandidate, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">
                      Họ và tên <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Nguyễn Văn A"
                      value={currentCandidate.name}
                      onChange={(e) =>
                        setCurrentCandidate({ ...currentCandidate, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      placeholder="0901234567"
                      value={currentCandidate.phone}
                      onChange={(e) =>
                        setCurrentCandidate({ ...currentCandidate, phone: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="note">Ghi chú</Label>
                    <Input
                      id="note"
                      placeholder="Kinh nghiệm 3 năm..."
                      value={currentCandidate.note}
                      onChange={(e) =>
                        setCurrentCandidate({ ...currentCandidate, note: e.target.value })
                      }
                    />
                  </div>
                </div>
                <Button onClick={handleAddCandidate} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm vào danh sách
                </Button>
              </div>

              {/* Candidates List */}
              {candidates.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Danh sách ứng viên ({candidates.length})
                  </h3>
                  <div className="space-y-2">
                    {candidates.map((candidate, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between p-3 bg-white border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{candidate.name}</p>
                          <p className="text-sm text-gray-600">{candidate.email}</p>
                          {candidate.phone && (
                            <p className="text-sm text-gray-600">{candidate.phone}</p>
                          )}
                          {candidate.note && (
                            <p className="text-sm text-gray-500 italic">{candidate.note}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCandidate(candidate.email)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Message */}
              <div>
                <Label htmlFor="customMessage">Tin nhắn tùy chỉnh (tùy chọn)</Label>
                <Textarea
                  id="customMessage"
                  rows={4}
                  placeholder="Thêm lời nhắn cá nhân hóa cho ứng viên..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Tin nhắn này sẽ được thêm vào email mời ứng tuyển
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* CSV Upload */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Tải lên file CSV</Label>
                  <Button variant="outline" size="sm" onClick={downloadCsvTemplate}>
                    <Download className="w-4 h-4 mr-2" />
                    Tải mẫu CSV
                  </Button>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">Kéo thả file CSV hoặc click để chọn</p>
                  <p className="text-sm text-gray-500 mb-4">
                    File CSV phải có các cột: email, name, phone, note
                  </p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCsvFileChange}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label htmlFor="csv-upload">
                    <Button type="button" variant="outline" asChild>
                      <span>Chọn file</span>
                    </Button>
                  </label>
                </div>

                {csvFile && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-green-800">Đã chọn: {csvFile.name}</span>
                  </div>
                )}
              </div>

              {/* CSV Preview */}
              {csvPreview.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Xem trước (5 dòng đầu tiên)</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {csvPreview.map((candidate, index) => (
                      <div key={index} className="flex items-start gap-3 p-2 bg-white rounded">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-1" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{candidate.name}</p>
                          <p className="text-sm text-gray-600">{candidate.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      File CSV sẽ được xử lý hoàn toàn trên server. Đảm bảo file có định dạng đúng.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Send Button */}
      <Card>
        <CardContent className="p-6">
          <Button
            onClick={handleSendInvites}
            disabled={
              !selectedJobId ||
              isSending ||
              (inviteMethod === 'manual' && candidates.length === 0) ||
              (inviteMethod === 'csv' && !csvFile)
            }
            className="w-full"
            size="lg"
          >
            {isSending ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Đang gửi...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Gửi lời mời (
                {inviteMethod === 'manual' ? candidates.length : csvPreview.length || '...'} ứng
                viên)
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InviteCandidatesPage;
