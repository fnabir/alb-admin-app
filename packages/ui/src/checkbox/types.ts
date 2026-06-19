export type CheckboxProps = {
  value: boolean;
  onChange?: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
};
