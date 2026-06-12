'use client';

import { RadioGroupProps } from './types';

export function RadioGroup({
  value,
  onValueChange,
  options,
  label,
  helperText,
  error,
  disabled,
  required,
  className = '',
}: RadioGroupProps) {
  return (
    <div className={`mx-auto ${className}`}>
      {label && (
        <p className="text-sm font-medium">
          {label} {required && <span className="text-error">*</span>}
        </p>
      )}

      <div className="flex gap-3 lg:gap-5">
        {options.map((o) => (
          <label
            key={o.value}
            className={`flex items-center gap-2 ${
              disabled ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <input
              type="radio"
              checked={value === o.value}
              onChange={() => onValueChange?.(o.value)}
              disabled={disabled}
              className="accent-accent"
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>

      {error ? (
        <p className="text-error text-sm">{error}</p>
      ) : (
        helperText && <p className="text-muted text-sm">{helperText}</p>
      )}
    </div>
  );
}
