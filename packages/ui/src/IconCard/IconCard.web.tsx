import { Card } from '../Card';
import { IconCardProps } from './types';

export function IconCard({ icon: Icon, title, details }: IconCardProps) {
  return (
    <Card className="hover:border-accent transition-colors duration-150">
      {Icon && <Icon className="size-6 lg:size-8 mx-auto mb-1 lg:mb-2" />}
      <div className={'text-center md:text-lg lg:text-xl mt-1'}>{title}</div>
      <div className={`text-sm lg:text text-muted text-center`}>{details}</div>
    </Card>
  );
}
