'use client';

import { useBreadcrumbs } from '@/components/BreadcrumbContext';
import { Loading } from '@/components/Loading';
import {
  formatCurrency,
  getDatabaseReference,
  getTotalValue,
  updateBalance,
} from '@repo/app';
import { toast, TotalBalanceRow, TransactionRow } from '@repo/ui';
import { useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useList, useObject } from 'react-firebase-hooks/database';
import { MdOutlineInfo } from 'react-icons/md';
import DeleteTransactionDialog from '@/components/DeleteTransactionDialog';

export default function ConveyanceTransaction() {
  const { id } = useParams<{ id: string }>();
  const staffId = decodeURIComponent(id);
  const { setItems } = useBreadcrumbs();

  const [staffData] = useObject(
    getDatabaseReference(`info/user/${staffId}/name`),
  );

  const staffName = staffData?.val();

  useEffect(() => {
    document.title = `${staffName} | Conveyance`;
  }, [staffName]);

  useEffect(() => {
    setItems([
      { label: 'Home', href: '/' },
      { label: 'Conveyance', href: '/conveyance' },
      { label: staffName },
    ]);
  }, [setItems, staffName]);

  const [data, transactionLoading, transactionError] = useList(
    getDatabaseReference(`transaction/conveyance/${staffId}`),
  );

  const [balance, balanceLoading, balanceError] = useObject(
    getDatabaseReference(`balance/conveyance/${staffId}`),
  );

  const balanceVal = balance?.val();
  const total = useMemo(() => {
    return data ? getTotalValue(data, 'amount') : 0;
  }, [data]);
  const totalValue = balanceVal?.value ?? 0;

  useEffect(() => {
    if (balanceLoading) return;
    if (balanceError) return;
    if (totalValue === total) return;

    const syncBalance = async () => {
      try {
        await updateBalance('conveyance', staffId, total);
        toast.success('Updated', 'Balance auto-synced.');
      } catch (err) {
        toast.error('Failed', 'Failed to sync balance.');
      }
    };

    syncBalance();
  }, [total, totalValue, balanceLoading, balanceError, staffId]);

  const loading = transactionLoading || balanceLoading;

  return (
    <div className="flex h-full w-full flex-col space-y-2 overflow-hidden min-h-0">
      <div className="shrink-0 px-2 md:px-3 lg:px-4"></div>
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loading isFullScreen={false} />
        </div>
      ) : transactionError || balanceError ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-lg">
          <MdOutlineInfo className="size-16" />
          {transactionError ? transactionError.message : balanceError?.message}
        </div>
      ) : !data || data.length == 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-lg">
          <MdOutlineInfo className="size-16" />
          No Record Found
        </div>
      ) : (
        <div className="flex-1 rounded-xl border-2 border-error flex flex-col h-full min-h-0 mx-2 lg:mx-4">
          <div className="flex px-2 lg:px-4 py-1 lg:py-2 text-lg md:text-xl lg:text-2xl font-semibold border-b-2 border-error">
            <span className="flex-1">Conveyance</span>
            <span>{formatCurrency(total)}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 mb-2">
            <div className="flex flex-col space-y-2 min-h-0">
              {data.map((item) => (
                <TransactionRow key={item.key} data={item}>
                  <DeleteTransactionDialog
                    type="staff"
                    id={staffId}
                    data={item}
                  />
                </TransactionRow>
              ))}
            </div>
          </div>
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
