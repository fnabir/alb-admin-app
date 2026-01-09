'use client';

import { useBreadcrumbs } from '@/components/BreadcrumbContext';
import { useEffect } from 'react';

export default function Ledger() {
  const { setItems } = useBreadcrumbs();

  useEffect(() => {
    setItems([{ label: 'Home', href: '/' }, { label: 'Financial Ledger' }]);
  }, [setItems]);

  return <div></div>;
}
