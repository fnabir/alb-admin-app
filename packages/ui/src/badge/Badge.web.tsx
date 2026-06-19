import { BadgeProps } from './types';

export function Badge({
  label,
  variant = 'default',
  className = '',
  textClassName = '',
}: BadgeProps) {
  const style = {
    text: {
      default: 'text-background',
      success: 'text-green-50',
      warning: 'text-yellow-50',
      error: 'text-red-50',
      light: 'text-black',
    },
    background: {
      default: 'bg-primary',
      success: 'bg-green-800',
      warning: 'bg-yellow-800',
      error: 'bg-red-800',
      light: 'bg-white',
    },
  };

  return (
    <div
      className={`w-fit ${style.background[variant]} text-sm px-1.5 lg:px-2 rounded-full font-medium ${className}`}
    >
      <span className={`${style.text[variant]} ${textClassName}`}>{label}</span>
    </div>
  );
}
