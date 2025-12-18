import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { CandidateSidebar } from './CandidateSidebar';
import { EmployerSidebar } from './EmployerSidebar';
import { Button } from '@/components/ui/button';
import { LogOut, Bell, User as UserIcon } from 'lucide-react';
import { ROUTES } from '@/constants';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {user?.role === 'EMPLOYER' ? <EmployerSidebar /> : <CandidateSidebar />}

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Xin chào, {user?.name || 'Ứng viên'}!
              </h2>
              <p className="text-sm text-gray-500">Chúc bạn một ngày làm việc hiệu quả</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={() => navigate(ROUTES.PROFILE)}
                  className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center hover:shadow-lg transition-shadow"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full" />
                  ) : (
                    <UserIcon className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>

              {/* Logout */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};
