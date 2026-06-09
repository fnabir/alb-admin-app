import { Pressable, View, Text } from 'react-native';
import { useLoading } from '../contexts/LoadingContext';
import { useRouter } from 'expo-router';
import { ThemedIcon } from './ThemedIcon';

type Props = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  right?: React.ReactNode;
};

export function HeaderBar({ title, subtitle, showBack = true, right }: Props) {
  const { startLoading } = useLoading();
  const router = useRouter();

  const handleGoBack = () => {
    startLoading(true);
    router.back();
    startLoading(false);
  };

  return (
    <View className="flex-row items-center min-h-12">
      {/* Left — back button */}
      <View className="w-16">
        {showBack && (
          <Pressable onPress={handleGoBack} className="px-4 py-2">
            <ThemedIcon name="arrow-back-outline" />
          </Pressable>
        )}
      </View>

      {/* Center — absolutely centered title */}
      <View className="absolute items-center justify-center left-16 right-16">
        <Text
          className={`${subtitle ? 'text-xl' : 'text-2xl'} font-medium text-primary`}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text className="text-muted" numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right — optional button */}
      <View className="flex-wrap ml-auto items-end">
        {right && <View className="px-4">{right}</View>}
      </View>
    </View>
  );
}
