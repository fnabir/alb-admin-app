import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Modal, View, Pressable, Text } from 'react-native';
import { useTheme } from '../../../../apps/mobile/src/contexts/ThemeContext';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
};

export function Dialog({ open, onOpenChange, children, title }: Props) {
  const { colorScheme } = useTheme();
  const primaryColor = colorScheme === 'dark' ? '#fafafa' : '#0a0a0a';

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
    >
      <Pressable
        className="flex-1 justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
        onPress={() => onOpenChange(false)}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View className="bg-card p-4 border border-accent rounded-xl gap-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-primary text-lg font-semibold capitalize">
                {title}
              </Text>
              <Pressable onPress={() => onOpenChange(false)} hitSlop={8}>
                <Ionicons name="close" size={24} color={primaryColor} />
              </Pressable>
            </View>
            {/* Content */}
            <View>{children}</View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
