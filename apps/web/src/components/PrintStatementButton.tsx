'use client';

import { useCallback, useState } from 'react';
import { MdPrint } from 'react-icons/md';
import { Button } from '@repo/ui';
import { generateStatementHtml, StatementRow } from '@repo/app';
import type { DataSnapshot } from 'firebase/database';

interface PrintStatementButtonProps {
  projectId: string;
  billData: DataSnapshot[];
  paymentData: DataSnapshot[];
  totalBill: number;
  totalPayment: number;
  balance: number;
}

async function fetchImageAsBase64(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`Failed to fetch letterpad: ${response.status}`);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function snapshotToStatementRow(snap: DataSnapshot): StatementRow {
  const val = snap.val();
  const paidData: Record<string, { details: string; amount: number }> =
    val.data ?? {};
  const paidArray = Object.entries(paidData).map(([key, value]) => ({
    key,
    details: value.details,
    amount: value.amount,
  }));
  return {
    date: val.date ?? '',
    title: val.title ?? '',
    details: val.details ?? '',
    amount: val.amount ?? 0,
    paidArray,
  };
}

export function PrintStatementButton({
  projectId,
  billData,
  paymentData,
  totalBill,
  totalPayment,
  balance,
}: PrintStatementButtonProps) {
  const [printing, setPrinting] = useState(false);

  const handlePrint = useCallback(async () => {
    setPrinting(true);
    try {
      const letterpadUri = await fetchImageAsBase64('/images/letterpad.png');

      const html = generateStatementHtml({
        projectId,
        billRows: billData.map(snapshotToStatementRow),
        paymentRows: paymentData.map(snapshotToStatementRow),
        totalBill,
        totalPayment,
        balance,
        letterpadUri,
      });

      const iframe = document.createElement('iframe');
      iframe.style.cssText =
        'position:fixed;width:0;height:0;border:none;visibility:hidden;';
      document.body.appendChild(iframe);

      const doc = iframe.contentDocument!;
      doc.open();
      doc.write(html);
      doc.close();

      // Wait for the iframe to fully load (CSS backgrounds, fonts, etc.)
      await new Promise<void>((resolve) => {
        if (iframe.contentDocument?.readyState === 'complete') {
          resolve();
        } else {
          iframe.onload = () => resolve();
        }
      });

      iframe.contentWindow!.focus();
      iframe.contentWindow!.print();

      // Clean up after the print dialog closes
      const cleanup = () => {
        if (document.body.contains(iframe)) document.body.removeChild(iframe);
      };
      iframe.contentWindow!.addEventListener('afterprint', cleanup, {
        once: true,
      });
      // Fallback cleanup in case afterprint doesn't fire
      setTimeout(cleanup, 30_000);
    } catch (error) {
      console.error('Print failed:', error);
    } finally {
      setPrinting(false);
    }
  }, [projectId, billData, paymentData, totalBill, totalPayment, balance]);

  return (
    <Button
      icon={MdPrint}
      label="Statement"
      loadingLabel="Preparing…"
      loading={printing}
      onPress={handlePrint}
    />
  );
}
