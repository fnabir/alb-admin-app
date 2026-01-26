'use client';

import { SelectProps } from './types';
import { selectStyles } from './styles';

export function Select({
  value,
  onChange,
  onBlur,
  label,
  placeholder = 'Select…',
  helperText,
  error,
  options,
  disabled,
  required,
  className = '',
}: SelectProps) {
  return (
    <div className={`${selectStyles.container} ${className}`}>
      {label && (
        <label className={selectStyles.label}>
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}

      <select
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        className={`
          ${selectStyles.field}
          ${error ? 'border-error' : 'border-border'}
        `}
      >
        <option value="">{placeholder}</option>

        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled ?? false}>
            {o.label}
          </option>
        ))}
      </select>

      {error ? (
        <p className={selectStyles.error}>{error}</p>
      ) : (
        helperText && <p className={selectStyles.helper}>{helperText}</p>
      )}
    </div>
  );
}
