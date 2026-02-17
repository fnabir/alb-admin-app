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
import { useEffect, useMemo, useState } from 'react';
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
  { value: 'name', label: 'Name' },
  { value: 'balance', label: 'Balance' },
];

type ProjectBalance = {
  snap: DataSnapshot;
  parsed: {
    id: string;
    balance: number;
    status: 'outstanding' | 'paid' | 'overpaid' | 'cancelled';
  };
};

export default function Project() {
  const { setItems } = useBreadcrumbs();

  useEffect(() => {
    document.title = 'Project | ALB Admin';
  }, []);

  useEffect(() => {
    setItems([{ label: 'Home', href: '/' }, { label: 'Project' }]);
  }, [setItems]);

  const [filter, setFilter] = usePersistedState<string>(
    'project-balance-filter',
    'all',
  );
  const [sort, setSort] = usePersistedState<string>(
    'project-balance-sort',
    'name',
  );

  const [data, dataLoading, dataError] = useList(
    getDatabaseReference('balance/project'),
  );

  const { projects, statusCounts } = useMemo(() => {
    const map = new Map<string, ProjectBalance>();
    const counts = {
      outstanding: 0,
      paid: 0,
      overpaid: 0,
      cancelled: 0,
    };

    if (!data?.length) {
      return { projects: [], statusCounts: counts };
    }

    for (const snap of data) {
      const val = snap.val();
      const balance = val.value ?? 0;

      const status: ProjectBalance['parsed']['status'] =
        val.status === 'cancel'
          ? 'cancelled'
          : balance < 0
            ? 'overpaid'
            : balance === 0
              ? 'paid'
              : 'outstanding';

      map.set(snap.key!, {
        snap,
        parsed: {
          id: snap.key!,
          balance,
          status,
        },
      });

      counts[status]++;
    }

    return {
      projects: Array.from(map.values()),
      statusCounts: counts,
    };
  }, [data]);

  const filterOptions: SelectOption[] = useMemo(() => {
    return [
      {
        value: 'all',
        label: 'All',
      },
      {
        value: 'outstanding',
        label: `Outstanding (${statusCounts.outstanding})`,
        disabled: statusCounts.outstanding === 0,
      },
      {
        value: 'paid',
        label: `Paid (${statusCounts.paid})`,
        disabled: statusCounts.paid === 0,
      },
      {
        value: 'overpaid',
        label: `Overpaid (${statusCounts.overpaid})`,
        disabled: statusCounts.overpaid === 0,
      },
      {
        value: 'cancelled',
        label: `Cancelled (${statusCounts.cancelled})`,
        disabled: statusCounts.cancelled === 0,
      },
    ];
  }, [statusCounts]);

  const processedData = useMemo(() => {
    let list = projects;

    if (filter !== '' && filter !== 'all') {
      list = list.filter((p) => p.parsed.status === filter);
    }

    switch (sort) {
      case 'name':
        list = [...list].sort((a, b) => a.parsed.id.localeCompare(b.parsed.id));
        break;

      case 'balance':
        list = [...list].sort((a, b) => b.parsed.balance - a.parsed.balance);
        break;
    }

    return list;
  }, [projects, filter, sort]);

  const total = useMemo(() => {
    return getTotalValue(data);
  }, [data]);

  const [balance, balanceLoading, balanceError] = useObject(
    getDatabaseReference('balance/total/project'),
  );

  const balanceVal = balance?.val();
  const totalValue = balanceVal?.value ?? 0;

  const loading = dataLoading || balanceLoading;
  const error = dataError || balanceError;

  useEffect(() => {
    if (loading) return;
    if (error) return;
    if (totalValue === total) return;

    const syncBalance = async () => {
      try {
        await updateTotalBalance('project', total);
        toast.success('Updated', 'Balance auto-synced.');
      } catch (err) {
        toast.error('Failed to sync balance.', 'Please reload the page.');
      }
    };

    syncBalance();
  }, [total, totalValue, loading, error]);

  return (
    <div className="size-full flex flex-col space-y-2">
      <div className="flex items-center space-x-2 px-2 md:px-3 lg:px-4">
        <span>Show</span>
        <Select
          value={filter}
          options={filterOptions}
          onChange={setFilter}
          className="max-w-36"
        />
        <div className="w-0.5 h-full bg-muted" />
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
              <LoadingLink
                key={item.parsed.id}
                href={`project/${item.parsed.id}`}
              >
                <BalanceRow data={item.snap} />
              </LoadingLink>
            );
          })}
        </div>
      )}
      {data?.length && (
        <TotalBalanceRow
          value={total}
          date={balanceVal?.date}
          error={balanceError?.message}
        />
      )}
    </div>
  );
}
