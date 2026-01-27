import { Card } from '../Card';
import { CallabckCardProps } from './types';

export function CallbackCard({ data, children }: CallabckCardProps) {
  const val = data?.val();
  return (
    <Card className={`flex space-x-2 hover:border-accent text-primary`}>
      <div className="flex-1">
        <div>{val.date}</div>
        <div className="flex-1 font-semibold pt-1">{val.details}</div>
        <div className="text-sm opacity-80">{val.name}</div>
      </div>

      {(val.status || children) && (
        <div>
          <div className="text-sm text-background bg-primary rounded-lg px-2 py-0.5">
            {val.status}
          </div>
          <div className="flex space-x-2">{children}</div>
        </div>
      )}
    </Card>
  );
}
