import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toastStore } from './store';
import { Toast } from './types';
import { ToastItem } from './ToastItem.native';

export function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const insets = useSafeAreaInsets();

  useEffect(() => toastStore.subscribe(setToasts), []);

  return (
    <View
      style={{ bottom: insets.bottom + 16 }}
      className="absolute left-0 right-0 z-50 gap-2"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </View>
  );
}
