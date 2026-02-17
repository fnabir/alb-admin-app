'use client';

import { useBreadcrumbs } from '@/components/BreadcrumbContext';
import { Loading } from '@/components/Loading';
import { LoadingLink } from '@/components/LoadingLink';
import {
  getDatabaseReference,
  getTotalValue,
  updateTotalBalance,
  usePersistedState,
} from '@repo/app';
import { useEffect, useMemo } from 'react';
import { useList, useObject } from 'react-firebase-hooks/database';
import {
  BalanceRow,
  EmptyUI,
  ErrorUI,
  Select,
  toast,
  TotalBalanceRow,
} from '@repo/ui';
import type { SelectOption } from '@repo/ui';
import { DataSnapshot } from 'firebase/database';

const sortOptions: SelectOption[] = [
  { value: 'position', label: 'Position' },
  { value: 'balance', label: 'Balance' },
];

type StaffBalance = {
  snap: DataSnapshot;
  parsed: {
    name: string;
    position: number;
    value: number;
  };
};

export default function Staff() {
  const { setItems } = useBreadcrumbs();

  useEffect(() => {
    document.title = 'Staff | ALB Admin';
  }, []);

  useEffect(() => {
    setItems([{ label: 'Home', href: '/' }, { label: 'Staff' }]);
  }, [setItems]);

  const [sort, setSort] = usePersistedState<string>(
    'staff-balance-sort',
    'position',
  );

  const [data, dataLoading, dataError] = useList(
    getDatabaseReference('balance/staff'),
  );

  const staffs = useMemo(() => {
    const map = new Map<string, StaffBalance>();

    if (!data?.length) {
      return [];
    }

    for (const snap of data) {
      const val = snap.val();

      map.set(snap.key!, {
        snap,
        parsed: {
          name: val.name,
          position: val.position,
          value: val.value,
        },
      });
    }

    return Array.from(map.values());
  }, [data]);

  const processedData = useMemo(() => {
    let list = staffs;

    switch (sort) {
      case 'position':
        list = [...list].sort((a, b) => a.parsed.position - b.parsed.position);
        break;

      case 'balance':
        list = [...list].sort((a, b) => b.parsed.value - a.parsed.value);
        break;
    }

    return list;
  }, [staffs, sort]);

  const total = useMemo(() => {
    return getTotalValue(data);
  }, [data]);

  const [balance, balanceLoading, balanceError] = useObject(
    getDatabaseReference('balance/total/staff'),
  );

  const [conveyance] = useObject(
    getDatabaseReference('balance/total/conveyance'),
  );

  const balanceVal = balance?.val();
  const totalValue = balanceVal?.value ?? 0;

  const conveyanceVal = conveyance?.val();
  const totalConveyance = conveyanceVal?.amount ?? 0;

  const loading = dataLoading || balanceLoading;
  const error = dataError || balanceError;

  useEffect(() => {
    if (loading) return;
    if (error) return;
    if (totalValue === total) return;

    const syncBalance = async () => {
      try {
        await updateTotalBalance('staff', total);
        toast.success('Updated', 'Balance auto-synced.');
      } catch (err) {
        toast.error('Failed', 'Failed to sync balance.');
      }
    };

    syncBalance();
  }, [total, totalValue, loading, error]);

  return (
    <div className="size-full flex flex-col space-y-2">
      <div className="flex items-center space-x-2 px-2 md:px-3 lg:px-4">
        <span>Sort</span>
        <Select
          value={sort}
          options={sortOptions}
          onChange={setSort}
          className="max-w-32"
        />
      </div>
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loading isFullScreen={false} />
        </div>
      ) : error ? (
        <ErrorUI error={error} />
      ) : !data?.length ? (
        <EmptyUI />
      ) : (
        <div className="flex-1 flex flex-col space-y-2 overflow-y-auto px-2 md:px-3 lg:px-4">
          {processedData.map((item) => {
            return (
              <LoadingLink key={item.snap.key} href={`staff/${item.snap.key}`}>
                <BalanceRow data={item.snap} title={item.parsed.name} />
              </LoadingLink>
            );
          })}
        </div>
      )}
      {data && data.length > 0 && (
        <LoadingLink href="/conveyance">
          <TotalBalanceRow
            title="Total Conveyance"
            value={totalConveyance}
            date={conveyanceVal?.date}
            error={conveyanceVal?.message}
          />
        </LoadingLink>
      )}
      {data && data.length > 0 && (
        <TotalBalanceRow
          value={total + totalConveyance}
          date={balanceVal?.date}
          error={balanceError?.message}
        />
      )}
    </div>
  );
}
