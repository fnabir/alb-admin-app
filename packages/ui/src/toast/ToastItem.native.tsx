import { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { toastStore } from './store';
import { Toast } from './types';

const variantStyles = {
  success: 'border-green-700 bg-green-700',
  error: 'border-red-700 bg-red-700',
  info: 'border-sky-700 bg-sky-700',
  warning: 'border-yellow-700 bg-yellow-700',
};

export function ToastItem({ toast }: { toast: Toast }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Fade + slide in
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Fade + slide out when closing
    if (toast.closing) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 20,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast.closing]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Pressable onPress={() => toastStore.close(toast.id)}>
        <View
          className={`rounded-t-2xl -mb-4 border p-4 ${variantStyles[toast.variant]}`}
        >
          {toast.title && (
            <Text
              className={`text-lg font-semibold text-white ${toast.description ? 'mb-1' : ''}`}
            >
              {toast.title}
            </Text>
          )}
          {toast.description && (
            <Text className={`text-white`}>{toast.description}</Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}
