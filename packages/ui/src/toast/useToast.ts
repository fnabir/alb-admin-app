import { toastStore } from './store';
import { ToastVariant } from './types';

function createToast(variant: ToastVariant) {
  return (title: string, description?: string) => {
    toastStore.show({
      id: crypto.randomUUID(),
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
