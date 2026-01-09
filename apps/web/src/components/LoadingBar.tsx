'use client';

import { useLoading } from '@/contexts/LoadingContext';
import { Loading } from './Loading';

export function LoadingBar() {
  const { isLoading, isFullScreen } = useLoading();

  if (isFullScreen && isLoading) return <Loading />;

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
      <div className="h-full bg-accent animate-loading-bar" />
    </div>
  );
}
