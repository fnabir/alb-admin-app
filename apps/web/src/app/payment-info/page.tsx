'use client';

import { useBreadcrumbs } from '@/components/BreadcrumbContext';
import { Loading } from '@/components/Loading';
import { getDatabaseReference } from '@repo/app';
import { useEffect, useMemo } from 'react';
import { useList } from 'react-firebase-hooks/database';
import { MdOutlineInfo } from 'react-icons/md';
import { DataSnapshot } from 'firebase/database';
import { Card, PaymentInfoRow } from '@repo/ui';
import { useAuth } from '@/contexts/AuthContext';
import AddPaymentInfoDialog from './addPaymentInfoDialog';
import DeletePaymentInfoDialog from './deletePaymentInfoDialog';

const PAYMENT_TYPE_LABEL: Record<string, string> = {
  bank: 'bank transfer',
  account: 'account transfer',
  cell: 'cellfin',
};

export default function PaymentInfo() {
  const { setItems } = useBreadcrumbs();

  useEffect(() => {
    document.title = 'Payment Info | ALB Admin';
  }, []);

  useEffect(() => {
    setItems([{ label: 'Home', href: '/' }, { label: 'Payment Info' }]);
  }, [setItems]);

  const { isAdmin } = useAuth();

  const [data, loading, error] = useList(getDatabaseReference('info/payment'));

  const paymentData = useMemo(() => {
    if (!data) return {};
    return Object.fromEntries(data.map((snapshot) => [snapshot.key, snapshot]));
  }, [data]);

  return (
    <div className="flex h-full w-full flex-col space-y-2 overflow-hidden min-h-0">
      <div className="shrink-0 px-2 md:px-3 lg:px-4">
        <AddPaymentInfoDialog />
      </div>
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loading isFullScreen={false} />
        </div>
      ) : error ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-lg">
          <MdOutlineInfo className="size-16" />
          {error?.message}
        </div>
      ) : !data || data.length == 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-lg">
          <MdOutlineInfo className="size-16" />
          No Record Found
        </div>
      ) : (
        <div className="grid gap-2 lg:gap-3 grid-cols-1 lg:grid-cols-3 px-2 md:px-3 lg:px-4 overflow-auto">
          {(paymentData.cash || paymentData.bKash || paymentData.cell) && (
            <div className="grid gap-2 lg:gap-3 grid-cols-1">
              {paymentData.cash && (
                <PaymentInfoGrid data={paymentData.cash} isAdmin={isAdmin} />
              )}
              {paymentData.bKash && (
                <PaymentInfoGrid data={paymentData.bKash} isAdmin={isAdmin} />
              )}
              {paymentData.cell && (
                <PaymentInfoGrid data={paymentData.cell} isAdmin={isAdmin} />
              )}
            </div>
          )}
          {(paymentData.account || paymentData.cheque) && (
            <div className="grid gap-2 lg:gap-3 grid-cols-1">
              {paymentData.account && (
                <PaymentInfoGrid data={paymentData.account} isAdmin={isAdmin} />
              )}
              {paymentData.cheque && (
                <PaymentInfoGrid data={paymentData.cheque} isAdmin={isAdmin} />
              )}
            </div>
          )}
          {paymentData.bank && (
            <PaymentInfoGrid data={paymentData.bank} isAdmin={isAdmin} />
          )}
        </div>
      )}
    </div>
  );
}

function PaymentInfoGrid({
  data,
  isAdmin = false,
}: {
  data: DataSnapshot;
  isAdmin: boolean;
}) {
  const dataType = data.key!;

  return (
    <Card>
      <div className="text-lg text-center font-bold pt-2 pb-1 uppercase">
        {PAYMENT_TYPE_LABEL[dataType] || data.key!}
      </div>
      <div className={'text-xs md:text-sm lg:text-[15px] lg:text divide-y'}>
        {Object.entries(data.val()).map(([key, value]) => {
          return (
            <PaymentInfoRow
              type={dataType}
              id={key}
              value={value!.toString()}
              key={key}
            >
              {isAdmin && (
                <DeletePaymentInfoDialog
                  type={dataType}
                  id={key}
                  value={value!.toString()}
                />
              )}
            </PaymentInfoRow>
          );
        })}
      </div>
    </Card>
  );
}
