'use client';

import { useBreadcrumbs } from '@/components/BreadcrumbContext';
import { Loading } from '@/components/Loading';
import {
  formatCurrency,
  getDatabaseReference,
  getTotalValue,
  updateBalance,
} from '@repo/app';
import {
  Button,
  EmptyUI,
  ErrorUI,
  toast,
  TotalBalanceRow,
  TransactionRow,
  StaffTransactionDialog,
} from '@repo/ui';
import { useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useList, useObject } from 'react-firebase-hooks/database';
import { MdOutlineInfo } from 'react-icons/md';
import DeleteTransactionDialog from '@/components/DeleteTransactionDialog';
import { MdAdd, MdEdit } from 'react-icons/md';

export default function StaffTransaction() {
  const { id } = useParams<{ id: string }>();
  const staffId = decodeURIComponent(id);
  const { setItems } = useBreadcrumbs();

  const [staffData] = useObject(
    getDatabaseReference(`info/user/${staffId}/name`),
  );

  const staffName = staffData?.val();

  useEffect(() => {
    document.title = `${staffName} | Transaction`;
  }, [staffName]);

  useEffect(() => {
    setItems([
      { label: 'Home', href: '/' },
      { label: 'Staff', href: '/staff' },
      { label: staffName },
    ]);
  }, [setItems, staffName]);

  const [data, transactionLoading, transactionError] = useList(
    getDatabaseReference(`transaction/staff/${staffId}`),
  );

  const uniqueData = useMemo(() => {
    if (!data) return [];

    const seen = new Set<string>();

    return data.filter((snap) => {
      if (!snap.key) return false;
      if (seen.has(snap.key)) return false;
      seen.add(snap.key);
      return true;
    });
  }, [data]);

  const paymentData = useMemo(
    () =>
      uniqueData
        ? uniqueData.filter((item) => {
            return item.val().amount < 0;
          })
        : [],
    [uniqueData],
  );
  const billData = useMemo(
    () =>
      uniqueData
        ? uniqueData.filter((item) => {
            return item.val().amount >= 0;
          })
        : [],
    [uniqueData],
  );

  const [balance, balanceLoading, balanceError] = useObject(
    getDatabaseReference(`balance/staff/${staffId}`),
  );

  const balanceVal = balance?.val();
  const totalBill = useMemo(() => {
    return billData ? getTotalValue(billData, 'amount') : 0;
  }, [billData]);
  const totalPayment = useMemo(() => {
    return paymentData ? getTotalValue(paymentData, 'amount') : 0;
  }, [paymentData]);
  const total = useMemo(() => {
    return totalBill + totalPayment;
  }, [totalBill, totalPayment]);
  const totalValue = balanceVal?.value ?? 0;

  const loading = transactionLoading || balanceLoading;
  const error = transactionError || balanceError;

  useEffect(() => {
    if (loading) return;
    if (error) return;
    if (totalValue === total) return;

    const syncBalance = async () => {
      try {
        await updateBalance('staff', staffId, total);
        toast.success('Updated', 'Balance auto-synced.');
      } catch (err) {
        toast.error('Failed', 'Failed to sync balance.');
      }
    };

    syncBalance();
  }, [total, totalValue, loading, error, staffId]);

  return (
    <div className="flex h-full w-full flex-col space-y-2 overflow-hidden min-h-0">
      <div className="shrink-0 px-2 md:px-3 lg:px-4">
        <StaffTransactionDialog id={staffId} name={staffName}>
          <Button icon={MdAdd} label="Add" />
        </StaffTransactionDialog>
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
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2 px-2 md:px-3 lg:px-4 min-h-0">
          <div className="w-full rounded-xl border-2 border-error flex flex-col h-full min-h-0">
            <div className="flex px-2 lg:px-4 py-1 lg:py-2 text-lg md:text-xl lg:text-2xl font-semibold border-b-2 border-error">
              <span className="flex-1">Bill</span>
              <span>{formatCurrency(totalBill)}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 mb-2">
              {!billData || billData.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-lg">
                  <MdOutlineInfo className="size-16" />
                  No Record Found
                </div>
              ) : (
                <div className="flex flex-col space-y-2 min-h-0">
                  {billData
                    .sort((a, b) => b.key!.localeCompare(a.key!))
                    .map((item) => (
                      <TransactionRow key={item.key} data={item}>
                        <StaffTransactionDialog
                          id={staffId}
                          name={staffName}
                          data={item}
                        >
                          <Button icon={MdEdit} />
                        </StaffTransactionDialog>
                        <DeleteTransactionDialog
                          type="staff"
                          id={staffId}
                          data={item}
                        />
                      </TransactionRow>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="w-full rounded-xl border-2 border-success flex flex-col h-full min-h-0">
            <div className="flex px-2 lg:px-4 py-1 lg:py-2 text-lg md:text-xl lg:text-2xl font-semibold border-b-2 border-success">
              <span className="flex-1">Payment</span>
              <span>{formatCurrency(Math.abs(totalPayment))}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 mb-2">
              {!paymentData || paymentData.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-lg">
                  <MdOutlineInfo className="size-16" />
                  No Record Found
                </div>
              ) : (
                <div className="flex flex-col space-y-2 min-h-0">
                  {paymentData
                    .sort((a, b) => b.key!.localeCompare(a.key!))
                    .map((item) => (
                      <TransactionRow key={item.key} data={item}>
                        <StaffTransactionDialog
                          id={staffId}
                          name={staffName}
                          data={item}
                        >
                          <Button icon={MdEdit} />
                        </StaffTransactionDialog>
                        <DeleteTransactionDialog
                          type="staff"
                          id={staffId}
                          data={item}
                        />
                      </TransactionRow>
                    ))}
                </div>
              )}
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
