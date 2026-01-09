import { CardProps } from './types';

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`w-full px-2 md:px-3 lg:px-4 py-1.5 md:py-2 lg:py-2.5 rounded-xl bg-card border border-border transition-colors duration-150 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
