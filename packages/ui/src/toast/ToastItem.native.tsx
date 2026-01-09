import { View, Text } from 'react-native';
import { Toast } from './types';

const variantStyles = {
  success: 'border-green-500 bg-green-500/10',
  error: 'border-red-500 bg-red-500/10',
  info: 'border-sky-500 bg-sky-500/10',
  warning: 'border-yellow-500 bg-yellow-500/10',
};

export function ToastItem({ toast }: { toast: Toast }) {
  return (
    <View className={`rounded-xl border p-4 ${variantStyles[toast.variant]}`}>
      {toast.title && <Text className="font-medium">{toast.title}</Text>}
      {toast.description && (
        <Text className="text-sm text-muted">{toast.description}</Text>
      )}
    </View>
  );
}
