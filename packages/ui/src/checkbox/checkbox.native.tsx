import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CheckboxProps } from './types';

export function Checkbox({
  value,
  onChange,
  label,
  disabled,
  error,
  helperText,
  className,
}: CheckboxProps) {
  return (
    <View className={`gap-1 py-1 ${className ?? ''}`}>
      <Pressable
        onPress={() => !disabled && onChange?.(!value)}
        disabled={disabled}
        className={`flex-row items-center gap-2 ${disabled ? 'opacity-50' : ''}`}
      >
        <View
          className={`size-6 aspect-square rounded border items-center justify-center ${value ? 'bg-accent border-accent' : 'border-border bg-background'} ${error ? 'border-error' : ''}`}
        >
          {value && <Ionicons name="checkmark" size={20} color="#fff" />}
        </View>
        {label && (
          <Text className="text-lg text-primary font-medium">{label}</Text>
        )}
      </Pressable>
      {error ? (
        <Text className="text-sm text-error">{error}</Text>
      ) : (
        helperText && <Text className="text-sm text-muted">{helperText}</Text>
      )}
    </View>
  );
}
