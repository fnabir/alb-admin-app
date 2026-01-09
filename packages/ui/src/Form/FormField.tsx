import { View, Text } from 'react-native';
import { FormFieldProps } from './types';

export function FormField({
  label,
  error,
  helperText,
  required,
  children,
}: FormFieldProps) {
  return (
    <View className="space-y-1">
      {label && (
        <Text className="text-sm text-muted">
          {label}
          {required && <Text className="text-error"> *</Text>}
        </Text>
      )}

      {children}

      {error ? (
        <Text className="text-sm text-error">{error}</Text>
      ) : helperText ? (
        <Text className="text-sm text-muted">{helperText}</Text>
      ) : null}
    </View>
  );
}
