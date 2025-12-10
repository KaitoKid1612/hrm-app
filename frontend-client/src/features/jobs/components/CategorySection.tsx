import { Code, Database, Cloud, Smartphone, PenTool, BarChart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
  color: string;
}

const categories: Category[] = [
  {
    id: 'frontend',
    name: 'Frontend',
    icon: <Code className="w-5 h-5 sm:w-6 sm:h-6" />,
    count: 1234,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'backend',
    name: 'Backend',
    icon: <Database className="w-5 h-5 sm:w-6 sm:h-6" />,
    count: 987,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'devops',
    name: 'DevOps',
    icon: <Cloud className="w-5 h-5 sm:w-6 sm:h-6" />,
    count: 456,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'mobile',
    name: 'Mobile',
    icon: <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />,
    count: 789,
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'design',
    name: 'UI/UX Design',
    icon: <PenTool className="w-5 h-5 sm:w-6 sm:h-6" />,
    count: 567,
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'data',
    name: 'Data Science',
    icon: <BarChart className="w-5 h-5 sm:w-6 sm:h-6" />,
    count: 345,
    color: 'from-indigo-500 to-blue-500',
  },
];

export const CategorySection = () => {
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
            Khám Phá Theo Ngành Nghề
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Tìm kiếm công việc phù hợp với chuyên môn của bạn
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 group"
            >
              <CardContent className="p-4 sm:p-6 text-center">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-full bg-linear-to-br ${category.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                  {category.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  {category.count.toLocaleString()} việc làm
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
