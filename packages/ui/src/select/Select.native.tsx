import { View, Text, Pressable, Modal, FlatList } from 'react-native';
import { useState } from 'react';
import { SelectProps } from './types';
import { selectStyles } from './styles';

export function Select({
  value,
  onChange,
  label,
  placeholder = 'Select',
  helperText,
  error,
  options,
  disabled,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View className={`${selectStyles.container} ${className}`}>
      {label && <Text className={selectStyles.label}>{label}</Text>}

      <Pressable
        onPress={() => !disabled && setOpen(true)}
        className={`${selectStyles.field} ${error ? 'border-red-500' : ''}`}
      >
        <Text>{selected?.label ?? placeholder}</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="slide">
        <Pressable
          className="flex-1 bg-black/40"
          onPress={() => setOpen(false)}
        />

        <View className={selectStyles.sheet}>
          <FlatList
            data={options}
            keyExtractor={(o) => o.value}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  onChange?.(item.value);
                  setOpen(false);
                }}
                className={selectStyles.option}
              >
                <Text>{item.label}</Text>
              </Pressable>
            )}
          />
        </View>
      </Modal>

      {error ? (
        <Text className={selectStyles.error}>{error}</Text>
      ) : (
        helperText && <Text className={selectStyles.helper}>{helperText}</Text>
      )}
    </View>
  );
}
