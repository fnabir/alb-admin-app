import { IconType } from 'react-icons';

export type ButtonVariant =
  | 'accent'
  | 'primary'
  | 'danger'
  | 'secondary'
  | 'outline'
  | 'transparent';

export interface ButtonProps {
  label?: string;
  loadingLabel?: string;
  icon?: IconType;

  variant?: ButtonVariant;
  type?: 'button' | 'submit' | 'reset';

  loading?: boolean;
  disabled?: boolean;

  onPress?: () => void;

  ariaLabel?: string;
  className?: string;
}
