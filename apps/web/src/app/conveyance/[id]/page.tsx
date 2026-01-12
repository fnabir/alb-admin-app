'use client';

import { useBreadcrumbs } from '@/components/BreadcrumbContext';
import { Loading } from '@/components/Loading';
import { formatCurrency, getDatabaseReference, getTotalValue } from '@repo/app';
import { toast, TotalBalanceRow } from '@repo/ui';
import { useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useList, useObject } from 'react-firebase-hooks/database';
import { MdOutlineInfo } from 'react-icons/md';
import { update } from 'firebase/database';

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

  const paymentData = useMemo(
    () =>
      data
        ? data.filter((item) => {
            return item.val().amount < 0;
          })
        : [],
    [data],
  );
  const billData = useMemo(
    () =>
      data
        ? data.filter((item) => {
            return item.val().amount >= 0;
          })
        : [],
    [data],
  );

  const [balance, balanceLoading, balanceError] = useObject(
    getDatabaseReference(`balance/conveyance/${staffId}`),
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

  const handleUpdateBalance = async () => {
    try {
      await update(getDatabaseReference(`balance/conveyance/${staffId}`), {
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
                  {billData.map((item) => {
                    const val = item.val();
                    return (
                      <div
                        key={item.key}
                        className="w-full flex items-center py-1 lg:py-1.5 px-2 md:px-3 lg:px-4 space-x-4 bg-card rounded-lg"
                      >
                        <span className="text-sm">{val.date}</span>
                        <div className="flex-grow space-x-1">
                          <span className="font-semibold">{val.title}</span>
                          {val.details && <span>- {val.details}</span>}
                        </div>
                        <span className="text-lg font-semibold">
                          {formatCurrency(val.amount)}
                        </span>
                      </div>
                    );
                  })}
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
                  {paymentData.map((item) => {
                    const val = item.val();
                    return (
                      <div
                        key={item.key}
                        className="w-full flex items-center py-1 lg:py-1.5 px-2 md:px-3 lg:px-4 space-x-4 bg-card rounded-lg"
                      >
                        <span className="text-sm">{val.date}</span>
                        <div className="flex-grow space-x-1">
                          <span className="font-semibold">{val.title}</span>
                          {val.details && <span>- {val.details}</span>}
                        </div>
                        <span className="text-lg font-semibold">
                          {formatCurrency(val.amount)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
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
