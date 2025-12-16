import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface JobBenefitsProps {
  benefits: string | null;
}

export const JobBenefits = ({ benefits }: JobBenefitsProps) => {
  if (!benefits) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quyền lợi</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 whitespace-pre-line">{benefits}</p>
      </CardContent>
    </Card>
  );
};
