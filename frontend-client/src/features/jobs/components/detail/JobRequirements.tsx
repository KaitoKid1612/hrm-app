import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface JobRequirementsProps {
  requirements: string;
}

export const JobRequirements = ({ requirements }: JobRequirementsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Yêu cầu ứng viên</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 whitespace-pre-line">{requirements}</p>
      </CardContent>
    </Card>
  );
};
