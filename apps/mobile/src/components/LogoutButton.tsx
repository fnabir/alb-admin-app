import { Pressable, Text } from 'react-native';
import { useLoading } from '../contexts/LoadingContext';
import { signOut } from '@repo/app';
import { Ionicons } from '@expo/vector-icons';

export function LogoutButton() {
  const { startLoading } = useLoading();

  const handleSignOut = async () => {
    startLoading(true);
    await signOut();
  };

  return (
    <Pressable
      onPress={handleSignOut}
      className="bg-red-500 active:bg-red-600 px-4 py-2 rounded-lg flex-row items-center gap-2"
    >
      <Ionicons name="log-out-outline" size={20} color="white" />
      <Text className="text-white font-semibold">Logout</Text>
    </Pressable>
  );
}
