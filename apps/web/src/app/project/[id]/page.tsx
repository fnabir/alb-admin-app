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
  ProjectTransactionDialog,
  ProjectTransactionRow,
  toast,
  TotalBalanceRow,
} from '@repo/ui';
import { useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useList, useObject } from 'react-firebase-hooks/database';
import { MdAdd, MdEdit, MdOutlineInfo } from 'react-icons/md';
import DeleteTransactionDialog from '@/components/DeleteTransactionDialog';
import { PrintStatementButton } from '@/components/PrintStatementButton';
import type { SelectOption } from '@repo/ui';

export default function ProjectTransaction() {
  const { id } = useParams() as { id: string };
  const project = decodeURIComponent(id);
  const { setItems } = useBreadcrumbs();

  useEffect(() => {
    document.title = `${project} | Transaction`;
  }, [project]);

  useEffect(() => {
    setItems([
      { label: 'Home', href: '/' },
      { label: 'Project', href: '/project' },
      { label: project },
    ]);
  }, [setItems, project]);

  const [data, transactionLoading, transactionError] = useList(
    getDatabaseReference(`transaction/project/${project}`),
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

  const billData = useMemo(
    () => uniqueData.filter((item) => item.val().amount >= 0),
    [uniqueData],
  );
  const paymentData = useMemo(
    () => uniqueData.filter((item) => item.val().amount < 0),
    [uniqueData],
  );

  const [balance, balanceLoading, balanceError] = useObject(
    getDatabaseReference(`balance/project/${project}`),
  );

  const totalBill = useMemo(
    () => getTotalValue(billData, 'amount'),
    [billData],
  );
  const totalPayment = useMemo(
    () => getTotalValue(paymentData, 'amount'),
    [paymentData],
  );

  const balanceVal = balance?.val();
  const total = useMemo(
    () => totalBill + totalPayment,
    [totalBill, totalPayment],
  );
  const totalValue = balanceVal?.value ?? 0;

  const loading = transactionLoading || balanceLoading;
  const error = transactionError || balanceError;

  useEffect(() => {
    if (loading) return;
    if (error) return;
    if (totalValue === total) return;

    const syncBalance = async () => {
      try {
        await updateBalance('project', project, total);
        toast.success('Updated', 'Balance auto-synced.');
      } catch (err) {
        toast.error('Failed', 'Failed to sync balance.');
      }
    };

    syncBalance();
  }, [total, totalValue, loading, error, project]);

  const paidDataOptions: SelectOption[] | undefined = useMemo(
    () =>
      uniqueData
        ?.filter((t) => t.val().amount < 0)
        .sort((a, b) => b.key!.localeCompare(a.key!))
        .map((item) => ({
          value: item.key!,
          label: `${item.val().date} ${item.val().title}: ${formatCurrency(
            Math.abs(item.val().amount),
          )}`,
        })),
    [uniqueData],
  );

  const servicingCharge = Number(
    useObject(
      getDatabaseReference(`info/project/${project}/servicing`),
    )[0]?.val() ?? 0,
  );

  return (
    <div className="flex h-full w-full flex-col space-y-2 overflow-hidden min-h-0">
      <div className="px-2 md:px-3 lg:px-4 flex items-center gap-2">
        <ProjectTransactionDialog
          id={project}
          servicingCharge={servicingCharge}
          paidDataOptions={paidDataOptions}
        >
          <Button icon={MdAdd} label="Add" />
        </ProjectTransactionDialog>
        {data && data.length > 0 && (
          <PrintStatementButton
            projectId={project}
            billData={billData}
            paymentData={paymentData}
            totalBill={totalBill}
            totalPayment={totalPayment}
            balance={total}
          />
        )}
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
                    .map((item) => {
                      const paidData = item?.val().data;
                      const paidArray = Object.entries(paidData ?? {}).map(
                        ([key, value]) => ({
                          key,
                          ...(value as object),
                        }),
                      );
                      const totalPaid: number = Object.values(
                        paidData ?? {},
                      ).reduce(
                        (sum: number, item: any) =>
                          sum + Number(item.amount || 0),
                        0,
                      );
                      return (
                        <ProjectTransactionRow
                          key={item.key}
                          transactionData={item}
                          paidArray={paidArray}
                          totalPaid={totalPaid}
                        >
                          <ProjectTransactionDialog
                            id={project}
                            data={item}
                            servicingCharge={servicingCharge}
                            paidArray={paidArray}
                            paidDataOptions={paidDataOptions}
                            total={totalPaid}
                          >
                            <Button icon={MdEdit} />
                          </ProjectTransactionDialog>
                          <DeleteTransactionDialog
                            type="project"
                            id={project}
                            data={item}
                          />
                        </ProjectTransactionRow>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

          <div className="w-full rounded-xl border-2 border-success flex flex-col h-full min-h-0">
            <div className="flex px-2 lg:px-4 py-1 lg:py-2 text-lg md:text-xl lg:text-2xl font-semibold border-b-2 border-success rounded-t-xl">
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
                    .map((item) => {
                      const paidData = item?.val().data;
                      const paidArray = Object.entries(paidData ?? {}).map(
                        ([key, value]) => ({
                          key,
                          ...(value as object),
                        }),
                      );
                      const totalPaid: number = Object.values(
                        paidData ?? {},
                      ).reduce(
                        (sum: number, item: any) =>
                          sum + Number(item.amount || 0),
                        0,
                      );
                      return (
                        <ProjectTransactionRow
                          key={item.key}
                          transactionData={item}
                          paidArray={paidArray}
                          totalPaid={totalPaid}
                        >
                          <ProjectTransactionDialog
                            id={project}
                            data={item}
                            paidArray={paidArray}
                          >
                            <Button icon={MdEdit} />
                          </ProjectTransactionDialog>
                          <DeleteTransactionDialog
                            type="project"
                            id={project}
                            data={item}
                          />
                        </ProjectTransactionRow>
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
          date={balanceVal?.date}
          error={balanceError?.message}
        />
      )}
    </div>
  );
}
