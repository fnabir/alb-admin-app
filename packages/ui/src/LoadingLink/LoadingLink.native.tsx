'use client';

import { useRouter, useNavigationContainerRef } from 'expo-router';
import { useLoading } from '../../../../apps/mobile/src/contexts/LoadingContext';
import { TouchableOpacity } from 'react-native';
import { ReactNode, useEffect } from 'react';

type LoadingLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function LoadingLink({ href, children, className }: LoadingLinkProps) {
  const router = useRouter();
  const navigationRef = useNavigationContainerRef();
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const unsubscribe = navigationRef.addListener('state', () => {
      stopLoading();
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePress = () => {
    startLoading();
    router.push(href as any);
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
