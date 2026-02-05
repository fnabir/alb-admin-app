'use client';

import { useBreadcrumbs } from '@/components/BreadcrumbContext';
import { useEffect } from 'react';

export default function ErrorCode() {
  const { setItems } = useBreadcrumbs();

  useEffect(() => {
    setItems([{ label: 'Home', href: '/' }, { label: 'Error Code' }]);
  }, [setItems]);

  return <div></div>;
}
