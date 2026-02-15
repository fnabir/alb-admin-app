import { Pressable, Text, View } from 'react-native';
import { ButtonProps } from './types';
import { buttonStyles } from './styles';

export function Button({
  label,
  loadingLabel,
  icon,
  variant = 'primary',
  loading = false,
  disabled = false,
  onPress,
  className = '',
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      className={`
        ${buttonStyles.base}
        ${buttonStyles.variant[variant]}
        ${className}
      `}
    >
      {loading ? (
        <View className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
      ) : (
        <>
          {icon}
          {label && (
            <Text className="text-white">
              {loading && loadingLabel ? loadingLabel : label}
            </Text>
          )}
        </>
      )}
    </Pressable>
  );
}
