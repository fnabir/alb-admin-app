import { toastStore } from './store';
import { ToastVariant } from './types';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createToast(variant: ToastVariant) {
  return (title: string, description?: string) => {
    toastStore.show({
      id: generateId(),
      title,
      description,
      variant,
    });
  };
}

export const toast = {
  success: createToast('success'),
  error: createToast('error'),
  info: createToast('info'),
  warning: createToast('warning'),
};
