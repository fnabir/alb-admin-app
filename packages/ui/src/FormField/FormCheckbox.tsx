'use client';

import { Control, Controller, FieldValues, Path } from 'react-hook-form';
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
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Checkbox
          {...props}
          value={!!field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
