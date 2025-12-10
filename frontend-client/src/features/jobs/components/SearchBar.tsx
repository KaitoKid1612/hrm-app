import { useState } from 'react';
import { Search, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (keyword: string, location: string) => void;
}

const popularKeywords = [
  'Frontend',
  'Backend',
  'Full-stack',
  'DevOps',
  'Mobile',
  'React',
  'NodeJS',
  'Python',
];

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword, location);
  };

  return (
    <div className="bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-2xl p-2 sm:p-3 backdrop-blur-sm"
          >
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Keyword Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm công việc, công ty..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="pl-10 sm:pl-12 h-12 sm:h-14 border-0 focus-visible:ring-0 text-sm sm:text-base bg-gray-50 rounded-xl"
                />
              </div>

              {/* Location Input */}
              <div className="sm:w-48 lg:w-64 relative">
                <MapPin className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  type="text"
                  placeholder="Địa điểm"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 sm:pl-12 h-12 sm:h-14 border-0 focus-visible:ring-0 text-sm sm:text-base bg-gray-50 rounded-xl"
                />
              </div>

              {/* Search Button */}
              <Button
                type="submit"
                className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
                <span className="hidden sm:inline">Tìm kiếm</span>
              </Button>
            </div>
          </form>

          {/* Popular Keywords - Responsive */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 text-white/90">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">Từ khóa phổ biến:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {popularKeywords.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setKeyword(tag);
                    onSearch(tag, location);
                  }}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/30 hover:border-white/50 hover:scale-105"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
