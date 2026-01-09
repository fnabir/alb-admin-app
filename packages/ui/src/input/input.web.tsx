'use client';

import { InputProps } from './types';
import { inputStyles } from './styles';
import { useState } from 'react';

export function Input(props: InputProps) {
  const {
    value,
    onChangeText,
    onBlur,
    label,
    placeholder,
    helperText,
    error,
    secureTextEntry,
    type = 'text',
    disabled,
    required,
    startAdornment,
    endAdornment,
    className = '',
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`${inputStyles.container} ${className}`}>
      {label && (
        <label className={inputStyles.label}>
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <div
        className={`
          ${inputStyles.fieldWrapper}
          ${error ? 'border-error' : 'border-border'}
          focus-within:border-accent
          ${disabled ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        {startAdornment}

        <input
          value={value ?? ''}
          onChange={(e) => onChangeText?.(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          type={secureTextEntry ? (showPassword ? 'text' : 'password') : type}
          className={inputStyles.field}
          disabled={disabled}
        />

        {secureTextEntry && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="text-muted text-sm select-none"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}

        {endAdornment}
      </div>

      {error ? (
        <p className={inputStyles.error}>{error}</p>
      ) : (
        helperText && <p className={inputStyles.helper}>{helperText}</p>
      )}
    </div>
  );
}
