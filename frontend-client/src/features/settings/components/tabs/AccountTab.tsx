import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface User {
  email?: string;
  role?: string;
  createdAt?: string;
}

interface AccountTabProps {
  user: User | null;
  isSaving: boolean;
  onDeleteAccount: () => void;
}

export const AccountTab = ({ user, isSaving, onDeleteAccount }: AccountTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý tài khoản</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-900 mb-2">Xóa tài khoản</h3>
          <p className="text-sm text-red-800 mb-4">
            Hành động này sẽ xóa vĩnh viễn tài khoản và tất cả dữ liệu của bạn. Hành động này không
            thể hoàn tác!
          </p>
          <Button variant="destructive" onClick={onDeleteAccount} disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa tài khoản
              </>
            )}
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Thông tin tài khoản</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Vai trò:</strong> {user?.role === 'EMPLOYER' ? 'Nhà tuyển dụng' : 'Ứng viên'}
            </p>
            <p>
              <strong>Ngày tham gia:</strong>{' '}
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
