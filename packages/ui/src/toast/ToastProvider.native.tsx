import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { toastStore } from './store';
import { Toast } from './types';
import { ToastItem } from './ToastItem.native';

export function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => toastStore.subscribe(setToasts), []);

  return (
    <View className="absolute top-12 left-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </View>
  );
}
