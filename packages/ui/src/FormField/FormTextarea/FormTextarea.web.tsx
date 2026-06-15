'use client';

import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { Textarea } from '../../textarea';

type FormTextareaProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function FormTextarea<T extends FieldValues>({
  name,
  control,
  label,
  helperText,
  required,
  className,
  ...props
}: FormTextareaProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}

      <Textarea {...field} {...props} error={!!error} />

      {error ? (
        <p className="text-xs text-error">{error.message}</p>
      ) : (
        helperText && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )
      )}
    </div>
  );
}
