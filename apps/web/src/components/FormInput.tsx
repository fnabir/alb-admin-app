import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Input } from '@repo/ui';

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;

  type?: 'text' | 'email' | 'password' | 'number';
  label?: string;
  placeholder?: string;
  helperText?: string;
  secureTextEntry?: boolean;

  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;

  disabled?: boolean;
  required?: boolean;
}

export function FormInput<T extends FieldValues>({
  name,
  control,
  type = 'text',
  label,
  placeholder,
  startAdornment,
  endAdornment,
  helperText,
  secureTextEntry,
  disabled,
  required,
}: FormInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Input
          type={type}
          label={label}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          value={field.value}
          startAdornment={startAdornment}
          endAdornment={endAdornment}
          onChangeText={(value) => {
            if (type === 'number') {
              field.onChange(value === '' ? undefined : Number(value));
            } else {
              field.onChange(value);
            }
          }}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
          helperText={helperText}
          disabled={disabled}
          required={required}
        />
      )}
    />
  );
}
