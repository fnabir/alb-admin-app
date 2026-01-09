'use client';

import { forwardRef } from 'react';
import { buttonStyles } from './styles';
import { ButtonProps } from './types';
import { Slot } from '@radix-ui/react-slot';

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonProps & { asChild?: boolean }
>(function Button(
  {
    label,
    loadingLabel,
    icon: Icon,
    variant = 'primary',
    type = 'button',
    loading = false,
    disabled = false,
    onPress,
    ariaLabel,
    className = '',
    asChild = false,
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading;
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      type={type}
      aria-label={ariaLabel}
      disabled={isDisabled}
      onClick={onPress}
      className={`
        ${buttonStyles.base}
        ${buttonStyles.variant[variant]}
        ${isDisabled ? buttonStyles.disabled : ''}
        ${className}
      `}
      {...props}
    >
      <>
        {loading ? (
          <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : null}
        {!loading && Icon ? <Icon className="size-5" /> : null}
        {label && <span>{loading && loadingLabel ? loadingLabel : label}</span>}
      </>
    </Comp>
  );
});
