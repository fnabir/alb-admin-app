import { Toast } from './types';

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l(toasts));
}

const ANIMATION_MS = 300;

export const toastStore = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    listener(toasts);
    return () => {
      listeners.delete(listener);
    };
  },

  show(toast: Toast) {
    toasts = [...toasts, { ...toast, closing: false }];
    notify();

    if (toast.duration !== Infinity) {
      setTimeout(() => {
        toastStore.close(toast.id);
      }, toast.duration ?? 4000);
    }
  },

  close(id: string) {
    toasts = toasts.map((t) => (t.id === id ? { ...t, closing: true } : t));
    notify();

    setTimeout(() => {
      toastStore.dismiss(id);
    }, ANIMATION_MS);
  },

  dismiss(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  },
};
