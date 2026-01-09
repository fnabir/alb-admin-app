'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLoading } from '@/contexts/LoadingContext';

export function useNavigationLoader() {
  const pathname = usePathname();
  const { stopLoading } = useLoading();

  useEffect(() => {
    stopLoading();
  }, [pathname, stopLoading]);
}
