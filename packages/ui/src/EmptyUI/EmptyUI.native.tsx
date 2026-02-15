import { MdOutlineInfo } from 'react-icons/md';
import { View } from 'react-native';

export function EmptyUI({ text = 'No Record Found' }: { text?: string }) {
  return (
    <View className="flex flex-1 flex-col items-center justify-center gap-2 text-lg">
      <MdOutlineInfo className="size-16" />
      {text}
    </View>
  );
}
