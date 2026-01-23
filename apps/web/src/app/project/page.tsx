'use client';

import { useBreadcrumbs } from '@/components/BreadcrumbContext';
import { Loading } from '@/components/Loading';
import { LoadingLink } from '@/components/LoadingLink';
import {
  getDatabaseReference,
  getTotalValue,
  updateTotalBalance,
} from '@repo/app';
import { useEffect, useMemo } from 'react';
import { useList, useObject } from 'react-firebase-hooks/database';
import { MdOutlineInfo } from 'react-icons/md';
import { BalanceRow, toast, TotalBalanceRow } from '@repo/ui';

export default function Project() {
  const { setItems } = useBreadcrumbs();

  useEffect(() => {
    document.title = 'Project | ALB Admin';
  }, []);

  useEffect(() => {
    setItems([{ label: 'Home', href: '/' }, { label: 'Project' }]);
  }, [setItems]);

  const [data, dataLoading, error] = useList(
    getDatabaseReference('balance/project'),
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
    getDatabaseReference('balance/total/project'),
  );

  const balanceVal = balance?.val();
  const totalValue = balanceVal?.value ?? 0;

  useEffect(() => {
    if (balanceLoading) return;
    if (balanceError) return;
    if (totalValue === total) return;

    const syncBalance = async () => {
      try {
        await updateTotalBalance('project', total);
        toast.success('Updated', 'Balance auto-synced.');
      } catch (err) {
        toast.error('Failed', 'Failed to sync balance.');
      }
    };

    syncBalance();
  }, [total, totalValue, balanceLoading, balanceError]);

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
              <LoadingLink key={item.key} href={`project/${item.key}`}>
                <BalanceRow data={item} />
              </LoadingLink>
            );
          })}
        </div>
      )}
      {data && data.length > 0 && (
        <TotalBalanceRow
          value={total}
          date={balanceVal?.date}
          error={balanceError?.message}
        />
      )}
    </div>
  );
}
