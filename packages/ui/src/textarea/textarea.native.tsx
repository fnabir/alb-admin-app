import React from 'react';
import { TextInput } from 'react-native';

export interface TextareaProps extends React.ComponentProps<typeof TextInput> {
  error?: boolean;
}

export const Textarea = React.forwardRef<TextInput, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        multiline
        textAlignVertical="top"
        className={`w-full min-h-[75px] rounded-md bg-border px-3 py-1.5 text-sm
          placeholder:text-muted
          border ${error ? 'border-error' : 'border-muted'}
          focus:outline-none focus:border-accent
          disabled:cursor-not-allowed disabled:opacity-50
          ${className}`}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';
