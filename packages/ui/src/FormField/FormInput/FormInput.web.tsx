import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { Input } from '../../input';

export function FormInput<T extends FieldValues>({
  name,
  control,
  ...props
}: {
  name: Path<T>;
  control: Control<T>;
} & Omit<React.ComponentProps<typeof Input>, 'value' | 'onChangeText'>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Input
          {...props}
          value={field.value ?? ''}
          onChangeText={(value) => {
            if (props.type === 'number') {
              if (props.allowDecimal) {
                const normalized = value.replace(',', '.');
                field.onChange(
                  isNaN(Number(normalized)) ? null : Number(normalized),
                );
              } else
                field.onChange(isNaN(Number(value)) ? null : Number(value));
            } else {
              field.onChange(value);
            }
          }}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
