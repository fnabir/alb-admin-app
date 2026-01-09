'use client';

import { useBreadcrumbs } from '@/components/BreadcrumbContext';
import { useEffect } from 'react';

export default function Project() {
  const { setItems } = useBreadcrumbs();

  useEffect(() => {
    setItems([{ label: 'Home', href: '/' }, { label: 'Payment Info' }]);
  }, [setItems]);

  return <div></div>;
}
