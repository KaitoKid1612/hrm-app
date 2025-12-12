import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  Building2,
  Settings,
  Bell,
  UserPlus,
} from 'lucide-react';
import { ROUTES } from '@/constants';

const menuItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: ROUTES.COMPANY_DASHBOARD,
  },
  {
    icon: Building2,
    label: 'Hồ sơ công ty',
    path: ROUTES.COMPANY_PROFILE,
  },
  {
    icon: Briefcase,
    label: 'Quản lý tin tuyển dụng',
    path: ROUTES.MANAGE_JOBS,
  },
  {
    icon: FileText,
    label: 'Đơn ứng tuyển',
    path: ROUTES.MANAGE_APPLICATIONS,
  },
  {
    icon: Users,
    label: 'Ứng viên',
    path: ROUTES.CANDIDATES,
  },
  {
    icon: UserPlus,
    label: 'Mời ứng viên',
    path: ROUTES.INVITE_CANDIDATES,
  },
  {
    icon: Bell,
    label: 'Thông báo',
    path: ROUTES.NOTIFICATIONS,
  },
  {
    icon: Settings,
    label: 'Cài đặt',
    path: ROUTES.SETTINGS,
  },
];

export const EmployerSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">Nhà tuyển dụng</h1>
        <p className="text-sm text-gray-600 mt-1">Quản lý tuyển dụng</p>
      </div>

      <nav className="px-3 pb-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-colors ${
                isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
