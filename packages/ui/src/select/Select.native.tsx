import { View, Text, Pressable, Modal, FlatList } from 'react-native';
import { useState } from 'react';
import { SelectProps } from './types';

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
    <View className={`gap-1 ${className}`}>
      {label && <Text className="text-primary">{label}</Text>}

      <Pressable
        onPress={() => !disabled && setOpen(true)}
        className={`w-full px-3 py-3 rounded-lg border bg-background ${error ? 'border-error' : 'border-muted'} ${disabled ? 'opacity-50' : ''}`}
      >
        <Text className="text-primary">{selected?.label ?? placeholder}</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="slide">
        <Pressable
          className="flex-1 bg-black/40"
          onPress={() => setOpen(false)}
        />

        <View className="absolute bottom-0 left-0 right-0 rounded-t-2xl border-t-2 border-accent px-4 pt-2 pb-4 max-h-[60%] bg-card">
          <FlatList
            data={options}
            keyExtractor={(o) => o.value}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => {
                  onChange?.(item.value);
                  setOpen(false);
                }}
                className={`py-2.5 ${index !== options.length - 1 ? 'border-b border-border' : ''}`}
              >
                <Text
                  className={`text-primary font-medium text-center text-lg`}
                >
                  {item.label}
                </Text>
              </Pressable>
            )}
          />
        </View>
      </Modal>

      {helperText || error ? (
        <Text className={`text-sm -mt-1 text-${error ? 'error' : 'muted'}`}>
          {error ?? helperText}
        </Text>
      ) : null}
    </View>
  );
}
