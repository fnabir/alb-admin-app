import { View, Text, Pressable, Modal, FlatList } from 'react-native';
import { useState } from 'react';
import { SelectProps } from './types';
import { ThemedIcon } from '../../../../apps/mobile/src/components/ThemedIcon';

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
        className={`w-full flex-row items-center px-3 py-3 rounded-lg border bg-background ${error ? 'border-error' : 'border-muted'} ${disabled ? 'opacity-50' : ''}`}
      >
        <Text className="flex-1 text-primary">
          {selected?.label ?? placeholder}
        </Text>
        <ThemedIcon name="chevron-down" size={20} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade">
        <Pressable
          className="flex-1 bg-black/40"
          onPress={() => setOpen(false)}
        />

        <View className="absolute bottom-0 left-0 right-0 rounded-t-2xl border-t-2 border-accent px-4 pt-2 pb-4 max-h-[60%] bg-card">
          <FlatList
            data={[{ label: placeholder, value: '' }, ...options]}
            keyExtractor={(o) => o.value || '__placeholder__'}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => {
                  onChange?.(item.value);
                  setOpen(false);
                }}
                className={`py-2.5 ${index !== options.length ? 'border-b border-border' : ''}`}
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
