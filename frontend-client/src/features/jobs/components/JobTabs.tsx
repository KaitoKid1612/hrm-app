import { Flame, Sparkles, Briefcase } from 'lucide-react';

interface JobTabsProps {
  activeTab: 'all' | 'hot' | 'new';
  onTabChange: (tab: 'all' | 'hot' | 'new') => void;
  jobCount: number;
}

interface TabItem {
  id: 'all' | 'hot' | 'new';
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
}

const tabs: TabItem[] = [
  {
    id: 'all',
    label: 'Tất cả công việc',
    shortLabel: 'Tất cả',
    icon: <Briefcase className="w-4 h-4" />,
  },
  { id: 'hot', label: 'Việc làm hot', shortLabel: 'Hot', icon: <Flame className="w-4 h-4" /> },
  { id: 'new', label: 'Việc làm mới', shortLabel: 'Mới', icon: <Sparkles className="w-4 h-4" /> },
];

export const JobTabs = ({ activeTab, onTabChange, jobCount }: JobTabsProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
      <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 whitespace-nowrap
              ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200 hover:border-gray-300'
              }
            `}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden text-sm">{tab.shortLabel}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 bg-white px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 shadow-sm">
        <span className="text-gray-600 text-sm sm:text-base">Tìm thấy</span>
        <span className="font-bold text-blue-600 text-lg sm:text-xl">{jobCount}</span>
        <span className="text-gray-600 text-sm sm:text-base">việc làm</span>
      </div>
    </div>
  );
};
