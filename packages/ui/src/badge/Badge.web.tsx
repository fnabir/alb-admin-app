import { BadgeProps } from './types';

export function Badge({ label, className = '' }: BadgeProps) {
  return (
    <div
      className={`w-fit bg-primary text-background text-sm lg:text-base px-2 lg:px-3 rounded-full font-semibold ${className}`}
    >
      {label}
    </div>
  );
}
