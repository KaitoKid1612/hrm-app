import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCandidateSearch, useSavedCandidates } from '../hooks/useCandidateSearch';
import { CandidateDetailModal } from './CandidateDetailModal';
import { CandidateProfile } from '../services/candidateSearchService';
import {
  Search,
  MapPin,
  Briefcase,
  Award,
  Mail,
  Clock,
  Bookmark,
  BookmarkCheck,
  Eye,
  SlidersHorizontal,
  User,
} from 'lucide-react';

const experienceLevels = [
  { value: '', label: 'Tất cả' },
  { value: '0-1', label: 'Dưới 1 năm' },
  { value: '1-3', label: '1-3 năm' },
  { value: '3-5', label: '3-5 năm' },
  { value: '5-10', label: '5-10 năm' },
  { value: '10+', label: 'Trên 10 năm' },
];

const availabilityOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'immediate', label: 'Sẵn sàng ngay' },
  { value: '1-week', label: 'Trong 1 tuần' },
  { value: '2-weeks', label: 'Trong 2 tuần' },
  { value: '1-month', label: 'Trong 1 tháng' },
];

export const SearchCandidatesPage = () => {
  const { candidates, isLoading, totalResults, searchCandidates } = useCandidateSearch();
  const { isSaved, saveCandidate, unsaveCandidate, loadSavedCandidates } = useSavedCandidates();

  const [showFilters, setShowFilters] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);

  // Filter states
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [availability, setAvailability] = useState('');

  useEffect(() => {
    loadSavedCandidates();
    // Initial search
    searchCandidates({});
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const filters = {
      keyword: keyword || undefined,
      location: location || undefined,
      skills: skills ? skills.split(',').map((s) => s.trim()) : undefined,
      experience: experience || undefined,
      availability: availability || undefined,
    };

    searchCandidates(filters);
  };

  const clearFilters = () => {
    setKeyword('');
    setLocation('');
    setSkills('');
    setExperience('');
    setAvailability('');
    searchCandidates({});
  };

  const handleToggleSave = async (candidateId: string) => {
    try {
      if (isSaved(candidateId)) {
        await unsaveCandidate(candidateId);
      } else {
        await saveCandidate(candidateId);
      }
    } catch {
      alert('Có lỗi xảy ra');
    }
  };

  const hasActiveFilters = keyword || location || skills || experience || availability;

  if (isLoading && candidates.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <User className="w-6 h-6 text-blue-600" />
            Tìm kiếm ứng viên
          </h1>
          <p className="text-gray-100 mt-1">Tìm kiếm và kết nối với ứng viên phù hợp</p>
        </div>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Main Search */}
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm theo tên, kỹ năng, vị trí..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="w-64 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Địa điểm"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={isLoading}>
                Tìm kiếm
              </Button>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-gray-100 hover:text-gray-900 font-medium"
              >
                <SlidersHorizontal className="w-5 h-5" />
                {showFilters ? 'Ẩn bộ lọc' : 'Hiển thị bộ lọc'}
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Award className="w-4 h-4 inline mr-1" />
                    Kỹ năng (phân cách bằng dấu phẩy)
                  </label>
                  <Input
                    type="text"
                    placeholder="React, Node.js, Python..."
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="w-4 h-4 inline mr-1" />
                    Kinh nghiệm
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {experienceLevels.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Sẵn sàng làm việc
                  </label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {availabilityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          Tìm thấy {totalResults} ứng viên
          {hasActiveFilters && ' phù hợp'}
        </h2>
      </div>

      {/* Candidates List */}
      {candidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100">
                    {candidate.avatar ? (
                      <img
                        src={candidate.avatar}
                        alt={candidate.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <User className="w-10 h-10" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="w-full">
                    <h3 className="text-lg font-semibold text-gray-900">{candidate.fullName}</h3>
                    {candidate.currentJobTitle && (
                      <p className="text-sm text-gray-600 mt-1">{candidate.currentJobTitle}</p>
                    )}
                  </div>

                  {/* Details */}
                  <div className="w-full space-y-2 text-sm text-gray-600">
                    {candidate.city && (
                      <div className="flex items-center justify-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {candidate.city}
                      </div>
                    )}
                    {candidate.yearsOfExperience !== undefined && (
                      <div className="flex items-center justify-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        {candidate.yearsOfExperience} năm kinh nghiệm
                      </div>
                    )}
                    {candidate.email && (
                      <div className="flex items-center justify-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{candidate.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  {candidate.resume?.skills && candidate.resume.skills.length > 0 && (
                    <div className="w-full">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {candidate.resume.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {candidate.resume.skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                            +{candidate.resume.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="w-full flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedCandidate(candidate)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Xem profile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleSave(candidate.id)}
                    >
                      {isSaved(candidate.id) ? (
                        <BookmarkCheck className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy ứng viên phù hợp
            </h3>
            <p className="text-gray-600 mb-4">
              Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
            </p>
            <Button onClick={clearFilters} variant="outline">
              Xóa bộ lọc
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          isOpen={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          isSaved={isSaved(selectedCandidate.id)}
          onToggleSave={() => handleToggleSave(selectedCandidate.id)}
        />
      )}
    </div>
  );
};

export default SearchCandidatesPage;
