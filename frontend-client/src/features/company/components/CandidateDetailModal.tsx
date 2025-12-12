import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CandidateProfile } from '../services/candidateSearchService';
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  GraduationCap,
  Calendar,
  Bookmark,
  BookmarkCheck,
  User,
  FileText,
} from 'lucide-react';

interface CandidateDetailModalProps {
  candidate: CandidateProfile;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

export const CandidateDetailModal = ({
  candidate,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
}: CandidateDetailModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Hồ sơ ứng viên</span>
            <Button variant="outline" size="sm" onClick={onToggleSave}>
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 mr-2 text-blue-600" />
                  Đã lưu
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 mr-2" />
                  Lưu
                </>
              )}
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start gap-6 pb-6 border-b border-gray-200">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 shrink-0">
              {candidate.avatar ? (
                <img
                  src={candidate.avatar}
                  alt={candidate.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <User className="w-12 h-12" />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{candidate.fullName}</h2>
              {candidate.currentJobTitle && (
                <p className="text-lg text-gray-600 mt-1">{candidate.currentJobTitle}</p>
              )}

              <div className="grid grid-cols-2 gap-3 mt-4 text-sm text-gray-600">
                {candidate.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${candidate.email}`} className="hover:text-blue-600">
                      {candidate.email}
                    </a>
                  </div>
                )}
                {candidate.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${candidate.phone}`} className="hover:text-blue-600">
                      {candidate.phone}
                    </a>
                  </div>
                )}
                {candidate.city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {candidate.city}
                  </div>
                )}
                {candidate.yearsOfExperience !== undefined && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    {candidate.yearsOfExperience} năm kinh nghiệm
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {candidate.bio && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Giới thiệu</h3>
              <p className="text-gray-700 whitespace-pre-line">{candidate.bio}</p>
            </div>
          )}

          {/* Resume Section */}
          {candidate.resume && (
            <>
              {/* Skills */}
              {candidate.resume.skills && candidate.resume.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Kỹ năng
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.resume.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Work Experience */}
              {candidate.resume.workExperience && candidate.resume.workExperience.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Kinh nghiệm làm việc
                  </h3>
                  <div className="space-y-4">
                    {candidate.resume.workExperience.map((exp, index) => (
                      <div key={index} className="border-l-2 border-blue-200 pl-4">
                        <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                        <p className="text-gray-600">{exp.company}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          {exp.duration}
                        </p>
                        {exp.description && (
                          <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {candidate.resume.education && candidate.resume.education.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Học vấn
                  </h3>
                  <div className="space-y-4">
                    {candidate.resume.education.map((edu, index) => (
                      <div key={index} className="border-l-2 border-green-200 pl-4">
                        <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                        <p className="text-gray-600">{edu.school}</p>
                        {edu.major && (
                          <p className="text-sm text-gray-500">Chuyên ngành: {edu.major}</p>
                        )}
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          {edu.year}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {candidate.resume.certifications && candidate.resume.certifications.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Chứng chỉ
                  </h3>
                  <div className="space-y-3">
                    {candidate.resume.certifications.map((cert, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-50 rounded flex items-center justify-center shrink-0">
                          <Award className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{cert.name}</h4>
                          <p className="text-sm text-gray-600">
                            {cert.issuer} • {cert.year}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button className="flex-1 bg-blue-500 hover:bg-blue-600">
              <Mail className="w-4 h-4 mr-2" />
              Gửi email
            </Button>
            <Button variant="outline" className="flex-1">
              <Phone className="w-4 h-4 mr-2" />
              Liên hệ
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateDetailModal;
