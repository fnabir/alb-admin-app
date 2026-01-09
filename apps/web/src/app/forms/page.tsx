'use client';

import { useBreadcrumbs } from '@/components/BreadcrumbContext';
import { useEffect } from 'react';

export default function Forms() {
  const { setItems } = useBreadcrumbs();

  useEffect(() => {
    setItems([{ label: 'Home', href: '/' }, { label: 'Forms' }]);
  }, [setItems]);

  return <div></div>;
}
