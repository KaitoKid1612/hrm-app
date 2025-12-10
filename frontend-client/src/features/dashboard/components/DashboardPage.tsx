import React from 'react';
import { useAuth } from '@/features/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold text-gray-900">Recruitment Platform</h1>
              <div className="flex gap-4">
                <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                Xin chào, <strong>{user?.name || user?.email}</strong>
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Thông tin cá nhân</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-gray-600">Email:</dt>
                  <dd className="font-medium">{user?.email}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Họ tên:</dt>
                  <dd className="font-medium">{user?.name || 'Chưa cập nhật'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Vai trò:</dt>
                  <dd className="font-medium">{user?.role}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Số điện thoại:</dt>
                  <dd className="font-medium">{user?.phone || 'Chưa cập nhật'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Địa chỉ:</dt>
                  <dd className="font-medium">{user?.address || 'Chưa cập nhật'}</dd>
                </div>
              </dl>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Trạng thái tài khoản</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-gray-600">Trạng thái:</dt>
                  <dd className="font-medium">
                    {user?.isActive ? (
                      <span className="text-green-600">Hoạt động</span>
                    ) : (
                      <span className="text-red-600">Vô hiệu hóa</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Ngày tạo:</dt>
                  <dd className="font-medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <Button onClick={() => navigate('/profile')}>Cập nhật thông tin</Button>
            <Button variant="outline" onClick={() => navigate('/employees')}>
              Quản lý nhân viên
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
