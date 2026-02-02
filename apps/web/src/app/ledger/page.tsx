'use client';

import { useBreadcrumbs } from '@/components/BreadcrumbContext';
import { usePersistedState } from '@repo/app';
import { SelectOption } from '@repo/ui/src/select/types';
import { useEffect } from 'react';

const filterOptions: SelectOption[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
];

export default function Ledger() {
  const { setItems } = useBreadcrumbs();

  useEffect(() => {
    setItems([{ label: 'Home', href: '/' }, { label: 'Financial Ledger' }]);
  }, [setItems]);

  const [filter, setFilter] = usePersistedState<string>(
    'ledger-filter',
    'daily',
  );

  return <div></div>;
}
