'use client';

import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { RadioGroup } from '../radio';

export function FormRadioGroup<T extends FieldValues>({
  name,
  control,
  ...props
}: {
  name: Path<T>;
  control: Control<T>;
} & Omit<React.ComponentProps<typeof RadioGroup>, 'value' | 'onValueChange'>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <RadioGroup
          {...props}
          value={field.value ?? ''}
          onValueChange={field.onChange}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
