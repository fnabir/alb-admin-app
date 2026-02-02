import * as React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full min-h-[75px] rounded-md border border-border bg-card px-3 py-1.5 text-sm
          placeholder:text-muted-foreground
          focus:outline-none focus:border-accent focus:border-ring
          disabled:cursor-not-allowed disabled:opacity-50
          transition-colors duration-150
          ${error && 'border-error focus:ring-error'}
          ${className}`}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';
