import { useLoading } from '@repo/app';
import { signOut } from '@repo/app';
import { Button } from '@repo/ui';
import { MdLogout } from 'react-icons/md';

export function LogoutButton() {
  const { startLoading } = useLoading();

  const handleSignOut = async () => {
    startLoading(true);
    await signOut();
  };

  return (
    <Button
      icon={MdLogout}
      variant="transparent"
      aria-label="Logout Button"
      onPress={handleSignOut}
    />
  );
}
