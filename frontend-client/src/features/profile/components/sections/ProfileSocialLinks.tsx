import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Linkedin, Github, Globe } from 'lucide-react';

interface ProfileSocialLinksProps {
  formData: {
    linkedinUrl: string;
    githubUrl: string;
    portfolioUrl: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileSocialLinks = ({ formData, onChange }: ProfileSocialLinksProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Liên kết mạng xã hội</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="linkedinUrl">
            <Linkedin className="w-4 h-4 inline mr-2" />
            LinkedIn
          </Label>
          <Input
            id="linkedinUrl"
            name="linkedinUrl"
            type="url"
            value={formData.linkedinUrl}
            onChange={onChange}
            placeholder="https://linkedin.com/in/yourprofile"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="githubUrl">
            <Github className="w-4 h-4 inline mr-2" />
            GitHub
          </Label>
          <Input
            id="githubUrl"
            name="githubUrl"
            type="url"
            value={formData.githubUrl}
            onChange={onChange}
            placeholder="https://github.com/yourusername"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="portfolioUrl">
            <Globe className="w-4 h-4 inline mr-2" />
            Portfolio
          </Label>
          <Input
            id="portfolioUrl"
            name="portfolioUrl"
            type="url"
            value={formData.portfolioUrl}
            onChange={onChange}
            placeholder="https://yourportfolio.com"
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
};
