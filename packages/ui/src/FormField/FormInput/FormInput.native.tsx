import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Input, InputProps } from '../../input/input.native';

type FormInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
} & Omit<InputProps, 'value' | 'onChangeText'>;

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
          value={
            props.type === 'number'
              ? field.value === 0
                ? ''
                : String(field.value ?? '')
              : String(field.value ?? '')
          }
          onChangeText={(text) => {
            if (props.type === 'number') {
              const num = parseFloat(text);
              field.onChange(isNaN(num) ? 0 : num);
            } else {
              field.onChange(text);
            }
          }}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
