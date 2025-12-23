import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Bookmark,
  User,
  Settings,
  Home,
  MessageSquare,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: 'Tổng quan',
    path: ROUTES.DASHBOARD,
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: 'Tìm việc làm',
    path: ROUTES.JOBS,
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    label: 'Việc đã ứng tuyển',
    path: ROUTES.MY_APPLICATIONS,
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: 'Việc đã lưu',
    path: ROUTES.SAVED_JOBS,
    icon: <Bookmark className="w-5 h-5" />,
  },
  {
    label: 'Hồ sơ của tôi',
    path: ROUTES.MY_RESUME,
    icon: <User className="w-5 h-5" />,
  },
  {
    label: 'Tin nhắn',
    path: ROUTES.MESSAGES,
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    label: 'Cài đặt',
    path: ROUTES.SETTINGS,
    icon: <Settings className="w-5 h-5" />,
  },
];

export const CandidateSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link to={ROUTES.HOME} className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              Vũng Áng Jobs
            </h1>
            <p className="text-xs text-gray-500">Ứng viên</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
