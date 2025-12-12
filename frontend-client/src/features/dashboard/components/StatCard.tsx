import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    icon: 'bg-blue-100',
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    icon: 'bg-green-100',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    icon: 'bg-purple-100',
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    icon: 'bg-orange-100',
  },
};

export const StatCard = ({ title, value, icon: Icon, color, trend }: StatCardProps) => {
  const colors = colorClasses[color];

  return (
    <div className={`${colors.bg} rounded-xl p-6 border border-gray-100`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${colors.text}`}>{value}</p>
          {trend && (
            <p className="text-xs text-gray-500 mt-2">
              <span className={trend.isPositive ? 'text-green-600' : 'text-red-600'}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}%
              </span>{' '}
              so với tháng trước
            </p>
          )}
        </div>
        <div className={`${colors.icon} p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
      </div>
    </div>
  );
};
