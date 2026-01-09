'use client';

import { useBreadcrumbs } from '@/components/BreadcrumbContext';
import { Loading } from '@/components/Loading';
import { LoadingLink } from '@/components/LoadingLink';
import { getDatabaseReference, getTotalValue } from '@repo/app';
import { useEffect, useMemo } from 'react';
import { useList, useObject } from 'react-firebase-hooks/database';
import { MdOutlineInfo } from 'react-icons/md';
import { update } from 'firebase/database';
import { BalanceRow, toast, TotalBalanceRow } from '@repo/ui';

export default function Staff() {
  const { setItems } = useBreadcrumbs();

  useEffect(() => {
    setItems([{ label: 'Home', href: '/' }, { label: 'Staff' }]);
  }, [setItems]);

  const [data, dataLoading, error] = useList(
    getDatabaseReference('balance/staff'),
  );

  const projects = useMemo(() => {
    if (!data) return [];
    const map = new Map<string, (typeof data)[number]>();

    for (const snap of data) {
      map.set(snap.key!, snap);
    }

    return Array.from(map.values());
  }, [data]);

  const total = useMemo(() => {
    return getTotalValue(data);
  }, [data]);

  const [balance, balanceLoading, balanceError] = useObject(
    getDatabaseReference('balance/total/staff'),
  );

  const [conveyance, conveyanceLoading, conveyanceError] = useObject(
    getDatabaseReference('balance/total/conveyance'),
  );

  const balanceVal = balance?.val();
  const totalValue = balanceVal?.value ?? 0;

  const conveyanceVal = conveyance?.val();

  const handleUpdateBalance = async () => {
    try {
      await update(getDatabaseReference('balance/total/staff'), {
        value: total,
      });
      toast.success('Updated', 'Updated the total balance successfully.');
    } catch (error: any) {
      toast.error(
        'Failed',
        'Failed to update the total balance. Please try again.',
      );
    }
  };

  const loading = dataLoading || balanceLoading;

  return (
    <div className="flex h-full w-full flex-col space-y-2">
      <div className="shrink-0 px-2 md:px-3 lg:px-4"></div>
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loading isFullScreen={false} />
        </div>
      ) : error ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-lg">
          <MdOutlineInfo className="size-16" />
          {error.message}
        </div>
      ) : !data || data.length == 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-lg">
          <MdOutlineInfo className="size-16" />
          No Record Found
        </div>
      ) : (
        <div className="flex-1 flex flex-col space-y-2 overflow-y-auto px-2 md:px-3 lg:px-4">
          {projects.map((item) => {
            return (
              <LoadingLink key={item.key} href={`staff/${item.key}`}>
                <BalanceRow data={item} title={item.val().name} />
              </LoadingLink>
            );
          })}
        </div>
      )}
      {data && data.length > 0 && (
        <LoadingLink href="/conveyance">
          <TotalBalanceRow
            value={conveyanceVal?.value ?? 0}
            showUpdate={false}
            date={conveyanceVal?.date}
            error={conveyanceVal?.message}
          />
        </LoadingLink>
      )}
      {data && data.length > 0 && (
        <TotalBalanceRow
          value={total}
          showUpdate={total != totalValue}
          date={balanceVal?.date}
          error={balanceError?.message}
          onClick={handleUpdateBalance}
        />
      )}
    </div>
  );
}
