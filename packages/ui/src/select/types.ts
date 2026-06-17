import { SelectOption } from '@repo/app';
export interface SelectProps {
  value?: string | null;
  onChange?: (value: string) => void;
  onBlur?: () => void;

  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;

  options: SelectOption[];

  className?: string;
}
