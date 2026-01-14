import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Input } from '../../input';

type FormInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
} & Omit<React.ComponentProps<typeof Input>, 'value' | 'onChangeText'>;

export function FormInput<T extends FieldValues>({
  name,
  control,
  ...props
}: FormInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Input
          {...props}
          value={field.value ?? ''}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
