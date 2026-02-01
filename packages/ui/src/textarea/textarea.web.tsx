import * as React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full min-h-[100px] rounded-md border bg-background px-3 py-2 text-sm
          placeholder:text-muted-foreground
          focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring
          disabled:cursor-not-allowed disabled:opacity-50
          ${error && 'border-error focus:ring-error'}
          ${className}`}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';
