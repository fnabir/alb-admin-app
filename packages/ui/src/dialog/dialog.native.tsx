import React from 'react';
import { Modal, View, StyleSheet, Pressable } from 'react-native';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

export function Dialog({ open, onOpenChange, children }: Props) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
    >
      <Pressable style={styles.overlay} onPress={() => onOpenChange(false)}>
        <View style={styles.content}>{children}</View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  content: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
  },
});
