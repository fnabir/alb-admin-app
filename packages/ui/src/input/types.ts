export interface InputProps {
  value?: string | number;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;

  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;

  secureTextEntry?: boolean;
  disabled?: boolean;
  required?: boolean;

  type?: 'text' | 'email' | 'password' | 'number' | 'date';
  allowDecimal?: boolean;

  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;

  className?: string;
}
