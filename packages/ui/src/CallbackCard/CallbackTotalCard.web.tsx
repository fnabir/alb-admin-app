import { Card } from '../Card';
import { CallabckTotalCardProps } from './types';

export function CallbackTotalCard({ project, count }: CallabckTotalCardProps) {
  return (
    <Card className="flex items-center justify-between hover:border-accent text-primary text-lg">
      <div>{project}</div>
      <div className="flex items-center justify-center rounded-full bg-primary text-background size-8 font-bold">
        {count}
      </div>
    </Card>
  );
}
