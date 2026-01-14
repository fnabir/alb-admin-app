export interface RadioOption {
  label: string;
  value: string;
}

export interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;

  options: RadioOption[];

  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;

  className?: string;
}
