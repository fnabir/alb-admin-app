'use client';

import { RadioGroupProps } from './types';
import { radioStyles } from './styles';

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
    <div className={`${radioStyles.container} ${className}`}>
      {label && (
        <p className={radioStyles.label}>
          {label} {required && <span className="text-error">*</span>}
        </p>
      )}

      <div className={radioStyles.group}>
        {options.map((o) => (
          <label
            key={o.value}
            className={`${radioStyles.option} ${
              disabled ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <input
              type="radio"
              checked={value === o.value}
              onChange={() => onValueChange?.(o.value)}
              disabled={disabled}
              className={radioStyles.input}
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>

      {error ? (
        <p className={radioStyles.error}>{error}</p>
      ) : (
        helperText && <p className={radioStyles.helper}>{helperText}</p>
      )}
    </div>
  );
}
