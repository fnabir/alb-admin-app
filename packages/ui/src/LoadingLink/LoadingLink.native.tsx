'use client';

import { useRouter } from 'expo-router';
import { useLoading } from '../../../../apps/mobile/src/contexts/LoadingContext';
import { TouchableOpacity } from 'react-native';
import { ReactNode } from 'react';

type LoadingLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function LoadingLink({ href, children, className }: LoadingLinkProps) {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();

  const handlePress = () => {
    startLoading();
    router.push(href as any);
    stopLoading();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={className}
    >
      {children}
    </TouchableOpacity>
  );
}
