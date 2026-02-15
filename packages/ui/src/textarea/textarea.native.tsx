import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

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
        className={`w-full min-h-[75px] rounded-md border border-border bg-card px-3 py-1.5 text-sm
          placeholder:text-muted
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
