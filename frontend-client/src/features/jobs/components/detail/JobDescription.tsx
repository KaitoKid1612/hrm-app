import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface JobDescriptionProps {
  description: string;
}

export const JobDescription = ({ description }: JobDescriptionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mô tả công việc</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 whitespace-pre-line">{description}</p>
      </CardContent>
    </Card>
  );
};
