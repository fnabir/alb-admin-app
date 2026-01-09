'use client';

import { useEffect, useState } from 'react';
import { toastStore } from './store';
import { Toast } from './types';
import { ToastItem } from './ToastItem.web';

export function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => toastStore.subscribe(setToasts), []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => toastStore.close(toast.id)}
        />
      ))}
    </div>
  );
}
