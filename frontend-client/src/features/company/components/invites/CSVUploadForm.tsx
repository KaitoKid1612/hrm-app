import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { InviteCandidate } from '../../services/inviteService';
import { Upload, Download, CheckCircle2, AlertCircle } from 'lucide-react';

interface CSVUploadFormProps {
  csvFile: File | null;
  csvPreview: InviteCandidate[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadTemplate: () => void;
}

export const CSVUploadForm = ({
  csvFile,
  csvPreview,
  onFileChange,
  onDownloadTemplate,
}: CSVUploadFormProps) => {
  return (
    <div className="space-y-6">
      {/* CSV Upload */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label>Tải lên file CSV</Label>
          <Button variant="outline" size="sm" onClick={onDownloadTemplate}>
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
            onChange={onFileChange}
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
  );
};
