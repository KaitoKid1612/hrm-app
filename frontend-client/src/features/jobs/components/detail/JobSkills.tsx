import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface JobSkillsProps {
  skills: Array<{
    id: string;
    skill: {
      name: string;
    };
  }>;
}

export const JobSkills = ({ skills }: JobSkillsProps) => {
  if (!skills || skills.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kỹ năng yêu cầu</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skills.map((jobSkill) => (
            <span
              key={jobSkill.id}
              className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100"
            >
              {jobSkill.skill.name}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
