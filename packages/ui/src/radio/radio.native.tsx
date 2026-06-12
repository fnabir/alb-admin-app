import { View, Text, Pressable } from 'react-native';
import { RadioGroupProps } from './types';

export function RadioGroup({
  value,
  onValueChange,
  options,
  label,
  helperText,
  error,
  disabled,
}: RadioGroupProps) {
  return (
    <View className="mx-auto">
      {label && <Text className="text-sm font-medium">{label}</Text>}

      <View className="flex flex-row flex-wrap gap-x-4 gap-y-2 my-0.5">
        {options.map((o) => {
          const selected = value === o.value;

          return (
            <Pressable
              key={o.value}
              disabled={disabled}
              onPress={() => onValueChange?.(o.value)}
              className={`flex flex-row items-center py-2 gap-2 ${disabled ? 'opacity-50' : ''}`}
            >
              <View
                className={`w-5 h-5 rounded-full border flex flex-row items-center justify-center ${
                  selected
                    ? disabled
                      ? 'border-muted'
                      : 'border-accent'
                    : 'border-primary'
                }`}
              >
                {selected && (
                  <View
                    className={`w-3.5 h-3.5 rounded-full ${disabled ? 'bg-muted' : 'bg-accent'}`}
                  />
                )}
              </View>
              <Text className="text-lg text-primary">{o.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {error ? (
        <Text className="text-sm text-error">{error}</Text>
      ) : (
        helperText && <Text className="text-sm text-muted">{helperText}</Text>
      )}
    </View>
  );
}
