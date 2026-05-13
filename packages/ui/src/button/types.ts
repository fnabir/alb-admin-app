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

  variant?: ButtonVariant;
  type?: 'button' | 'submit' | 'reset';

  loading?: boolean;
  disabled?: boolean;

  onPress?: () => void;

  ariaLabel?: string;
  className?: string;
}
