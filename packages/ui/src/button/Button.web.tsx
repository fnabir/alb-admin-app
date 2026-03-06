'use client';

import { forwardRef } from 'react';
import { ButtonProps } from './types';
import { Slot } from '@radix-ui/react-slot';

const style = {
  accent: 'text-white bg-gradient-to-b from-sky-600 to-sky-800',
  primary: 'text-background bg-primary',
  danger: 'text-white bg-gradient-to-b from-red-600 to-red-800',
  secondary: 'text-white bg-gradient-to-b from-zinc-600 to-zinc-800',
  outline:
    'text-primary bg-transparent rounded-md border-2 border-border hover:border-accent',
};

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
      className={`inline-flex items-center justify-center space-x-1
                  py-1 rounded-lg
                  shadow-md hover:shadow-lg
                  transition-all duration-200
        ${style[variant]}
        ${
          isDisabled
            ? 'opacity-40 pointer-events-none'
            : 'opacity-90 hover:opacity-100'
        }
        ${Icon && !label ? 'px-1' : 'px-2 lg:px-4'}
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
