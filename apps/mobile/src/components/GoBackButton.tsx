import { Pressable } from 'react-native';
import { useLoading } from '../contexts/LoadingContext';
import { useRouter } from 'expo-router';
import { ThemedIcon } from './ThemedIcon';

export function GoBackButton() {
  const { startLoading } = useLoading();
  const router = useRouter();

  const handleGoBack = () => {
    startLoading(true);
    router.back();
    startLoading(false);
  };

  return (
    <Pressable onPress={handleGoBack} className="px-4 py-2">
      <ThemedIcon name="arrow-back-outline" />
    </Pressable>
  );
}
