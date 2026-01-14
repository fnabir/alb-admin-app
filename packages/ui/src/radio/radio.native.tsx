import { View, Text, Pressable } from 'react-native';
import { RadioGroupProps } from './types';
import { radioStyles } from './styles';

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
    <View className={radioStyles.container}>
      {label && <Text className={radioStyles.label}>{label}</Text>}

      {options.map((o) => {
        const selected = value === o.value;

        return (
          <Pressable
            key={o.value}
            disabled={disabled}
            onPress={() => onValueChange?.(o.value)}
            className={`${radioStyles.option} ${disabled ? 'opacity-50' : ''}`}
          >
            <View
              className={`${radioStyles.circle} ${
                selected ? 'border-accent' : 'border-border'
              }`}
            >
              {selected && <View className={radioStyles.dot} />}
            </View>
            <Text>{o.label}</Text>
          </Pressable>
        );
      })}

      {error ? (
        <Text className={radioStyles.error}>{error}</Text>
      ) : (
        helperText && <Text className={radioStyles.helper}>{helperText}</Text>
      )}
    </View>
  );
}
