import { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { toastStore } from './store';
import { Toast } from './types';

const variantStyles = {
  success: 'border-green-500 bg-green-500/10',
  error:   'border-red-500 bg-red-500/10',
  info:    'border-sky-500 bg-sky-500/10',
  warning: 'border-yellow-500 bg-yellow-500/10',
};

const titleStyles = {
  success: 'text-green-700 dark:text-green-300',
  error:   'text-red-700 dark:text-red-300',
  info:    'text-sky-700 dark:text-sky-300',
  warning: 'text-yellow-700 dark:text-yellow-300',
};

const descStyles = {
  success: 'text-green-600 dark:text-green-400',
  error:   'text-red-600 dark:text-red-400',
  info:    'text-sky-600 dark:text-sky-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
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
  }, [toast.closing]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Pressable onPress={() => toastStore.close(toast.id)}>
        <View className={`rounded-xl border p-4 ${variantStyles[toast.variant]}`}>
          {toast.title && (
            <Text className={`font-medium ${titleStyles[toast.variant]}`}>
              {toast.title}
            </Text>
          )}
          {toast.description && (
            <Text className={`text-sm ${descStyles[toast.variant]}`}>
              {toast.description}
            </Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}
