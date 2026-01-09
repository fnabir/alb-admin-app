export interface InputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;

  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;

  secureTextEntry?: boolean;
  disabled?: boolean;
  required?: boolean;

  type?: 'text' | 'email' | 'password' | 'number';

  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;

  className?: string;
}
