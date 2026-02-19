'use client';

import { Button, LoadingLink } from '@repo/ui';
import Breadcrumb from './Breadcrumb';
import { LogoutButton } from './LogoutButton';
import { ThemeToggle } from './ThemeToggle';
import { FaUser } from 'react-icons/fa6';
import { useAuth } from '@/contexts/AuthContext';
import { MdMenu } from 'react-icons/md';

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuth();
  return (
    <header className="flex items-center justify-between mx-4">
      <Breadcrumb />
      <div className="space-x-2">
        <LoadingLink href="/user" className="hidden lg:inline-block">
          <Button icon={FaUser} label={user?.displayName ?? 'User'} />
        </LoadingLink>
        <ThemeToggle />
        <LogoutButton />
        <Button
          icon={MdMenu}
          variant="transparent"
          onPress={onMenuClick}
          className="lg:hidden"
        />
      </div>
    </header>
  );
}
