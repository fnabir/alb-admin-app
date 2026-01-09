import { Text } from 'react-native';
import { Card } from './Card';
import { DataSnapshot } from 'firebase/database';

interface ProjectInfoCardProps {
  data: DataSnapshot;
  className?: string;
}

export function ProjectInfoCard({ data, className }: ProjectInfoCardProps) {
  const val = data.val();
  return (
    <Card
      className={`hover:border-accent transition-colors duration-150 ${className}`}
    >
      <Text className="text-lg text-primary pb-1 capitalize">{val.name}</Text>
    </Card>
  );
}
