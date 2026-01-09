import { Text } from 'react-native';
import { Card } from '../Card';
import { IconCardProps } from './types';

export function IconCard({ icon: Icon, title, details }: IconCardProps) {
  return (
    <Card className="hover:border-accent transition-colors duration-150">
      {Icon && <Icon className="size-8 lg:size-10 mx-auto mb-4" />}
      <Text className={'text-center text-xl mt-1'}>{title}</Text>
      <Text className={`text-muted text-center`}>{details}</Text>
    </Card>
  );
}
