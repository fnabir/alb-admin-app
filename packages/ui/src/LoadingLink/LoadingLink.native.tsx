'use client';

import { useRouter } from 'expo-router';
import { useLoading } from '../../../../apps/mobile/src/contexts/LoadingContext';
import { Pressable, Text } from 'react-native';
import { ReactNode } from 'react';

type LoadingLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function LoadingLink({ href, children, className }: LoadingLinkProps) {
  const router = useRouter();
  const { startLoading } = useLoading();

  const handlePress = () => {
    startLoading();
    router.push(href);
  };

  return (
    <Pressable onPress={handlePress} className={className}>
      <Text>{children}</Text>
    </Pressable>
  );
}
