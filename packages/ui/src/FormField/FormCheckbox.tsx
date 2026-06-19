import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { Checkbox } from '../checkbox';
import { CheckboxProps } from '../checkbox/types';

type FormCheckboxProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
} & Omit<CheckboxProps, 'value' | 'onChange' | 'error'>;

export function FormCheckbox<T extends FieldValues>({
  name,
  control,
  ...props
}: FormCheckboxProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <Checkbox
      value={!!field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={error?.message}
      {...props}
    />
  );
}
