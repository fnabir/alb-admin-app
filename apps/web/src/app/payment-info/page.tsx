'use client';

import { useBreadcrumbs } from '@/components/BreadcrumbContext';
import { Loading } from '@/components/Loading';
import { getDatabaseReference } from '@repo/app';
import { useEffect } from 'react';
import { useList } from 'react-firebase-hooks/database';
import { MdOutlineInfo } from 'react-icons/md';
import { DataSnapshot } from 'firebase/database';
import { Card } from '@repo/ui';
import { useAuth } from '@/contexts/AuthContext';
import AddPaymentInfoDialog from './addPaymentInfoDialog';
import DeletePaymentInfoDialog from './deletePaymentInfoDialog';

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
  const accountPaymentData = data?.find(
    (snapshot) => snapshot.key === 'account',
  );
  const bankPaymentData = data?.find((snapshot) => snapshot.key === 'bank');
  const bkashPaymentData = data?.find((snapshot) => snapshot.key === 'bKash');
  const cashPaymentData = data?.find((snapshot) => snapshot.key === 'cash');
  const cellfinPaymentData = data?.find((snapshot) => snapshot.key === 'cell');
  const chequePaymentData = data?.find((snapshot) => snapshot.key === 'cheque');

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
          {(cashPaymentData || bkashPaymentData || cellfinPaymentData) && (
            <div className="grid gap-2 lg:gap-3 grid-cols-1">
              {cashPaymentData && (
                <PaymentInfoGrid data={cashPaymentData} isAdmin={isAdmin} />
              )}
              {bkashPaymentData && (
                <PaymentInfoGrid data={bkashPaymentData} isAdmin={isAdmin} />
              )}
              {cellfinPaymentData && (
                <PaymentInfoGrid data={cellfinPaymentData} isAdmin={isAdmin} />
              )}
            </div>
          )}
          {(accountPaymentData || chequePaymentData) && (
            <div className="grid gap-2 lg:gap-3 grid-cols-1">
              {accountPaymentData && (
                <PaymentInfoGrid data={accountPaymentData} isAdmin={isAdmin} />
              )}
              {chequePaymentData && (
                <PaymentInfoGrid data={chequePaymentData} isAdmin={isAdmin} />
              )}
            </div>
          )}
          {bankPaymentData && (
            <PaymentInfoGrid data={bankPaymentData} isAdmin={isAdmin} />
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
  return (
    <Card>
      <div className="text-lg text-center font-bold pt-2 pb-1 uppercase">
        {data.key === 'bank' || data.key === 'account'
          ? `${data.key!} transfer`
          : data.key === 'cell'
            ? 'cellfin'
            : data.key!}
      </div>
      <div className={'text-xs md:text-sm lg:text-[15px] lg:text divide-y'}>
        {Object.entries(data.val()).map(([key, value]) => {
          const dataType = data.key!;
          const originalId = key.split('_')[0];
          return (
            <div className="flex space-x-2 p-1 items-center" key={key}>
              <div className="flex-auto font-semibold">{`${
                dataType === 'account' ||
                (dataType === 'cell' && originalId.length === 8)
                  ? '***'
                  : ''
              }${originalId}`}</div>
              {dataType != 'cash' && <div>{value!.toString()}</div>}
              {isAdmin && (
                <DeletePaymentInfoDialog
                  type={dataType}
                  id={key}
                  value={value!.toString()}
                />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
