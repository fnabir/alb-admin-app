import {
  ref,
  set,
  get,
  update,
  remove,
  push,
  DatabaseReference,
} from 'firebase/database';
import { database } from './core';
import { fromISODate, getCurrentDate } from '../utils';

export function getDatabaseReference(path?: string): DatabaseReference {
  return ref(database, path ?? '/');
}

export function generateDatabaseKey(path: string): string {
  return push(getDatabaseReference(path)).key;
}

export async function getDatabaseReferenceExists(
  path: string,
): Promise<boolean> {
  const snapshot = await get(getDatabaseReference(path));
  return snapshot.exists();
}

export async function updateTransaction(
  type: 'project' | 'staff' | 'conveyance',
  id: string,
  key: string,
  data: object,
) {
  await set(getDatabaseReference(`transaction/${type}/${id}/${key}`), data);
  await update(getDatabaseReference(`balance/${type}/${id}`), {
    date: getCurrentDate('dd MMM yyyy'),
  });
}

export async function deleteTransaction(
  type: 'project' | 'staff' | 'conveyance',
  id: string,
  transactionId: string,
  dataKeys?: string[],
) {
  const updates: Record<string, null> = {};

  updates[transactionId] = null;

  if (type === 'project' && dataKeys?.length) {
    for (const key of dataKeys) {
      updates[`${key}/data/${transactionId}`] = null;
    }
  }

  await update(getDatabaseReference(`transaction/${type}/${id}`), updates);
}

export async function removeStalePaymentLinks(
  sign: string,
  id: string,
  val: { data?: Record<string, unknown> } | null,
  transactionId: string,
  nextPaymentData: Record<string, { amount: number; details: string }> | null,
) {
  if (sign !== '+') return;

  const previousData = (val?.data ?? {}) as Record<string, unknown>;
  const previousKeys = Object.keys(previousData);
  const nextKeys = new Set(Object.keys(nextPaymentData ?? {}));

  const staleKeys = previousKeys.filter((key) => !nextKeys.has(key));

  if (staleKeys.length === 0) return;

  await Promise.all(
    staleKeys.map((paymentKey) =>
      remove(
        getDatabaseReference(
          `transaction/project/${id}/${paymentKey}/data/${transactionId}`,
        ),
      ),
    ),
  );
}

export type ProjectPaymentLinkInput = {
  key: string;
  details: string;
  amount: number;
};

export async function updateProjectPaymentLink(
  id: string,
  transactionId: string,
  formData: { date: string; title: string; details?: string },
  paymentData: ProjectPaymentLinkInput,
) {
  const expenseRef = getDatabaseReference(
    `transaction/project/${id}/${transactionId}/data/${paymentData.key}`,
  );
  const paymentRef = getDatabaseReference(
    `transaction/project/${id}/${paymentData.key}/data/${transactionId}`,
  );

  const expensePayload = {
    details: `${fromISODate('dd.MM.yy', formData.date)} ${formData.title} - ${formData.details ?? ''}`,
    amount: paymentData.amount,
  };

  const paymentPayload = {
    details: paymentData.details,
    amount: paymentData.amount,
  };

  await Promise.all([
    update(expenseRef, paymentPayload),
    update(paymentRef, expensePayload),
  ]);
}

export async function updateProjectPartialPaymentLinks(
  id: string,
  transactionId: string,
  formData: { date: string; title: string; details?: string },
  partialPayments: ProjectPaymentLinkInput[],
) {
  const validPayments = partialPayments.filter(
    (item) => item.key && item.key !== 'Select' && item.details !== 'Select',
  );

  await Promise.all(
    validPayments.map((paymentData) =>
      updateProjectPaymentLink(id, transactionId, formData, paymentData),
    ),
  );
}

export async function updateBalance(
  type: 'project' | 'staff' | 'conveyance',
  id: string,
  total: number,
) {
  await update(getDatabaseReference(`balance/${type}/${id}`), {
    value: total,
  });
}

export async function updateTotalBalance(
  type: 'project' | 'staff' | 'conveyance',
  total: number,
) {
  await update(getDatabaseReference(`balance/total/${type}`), {
    value: total,
  });
}

// Project Info
export async function updateProjectInfo(project: string, data: object) {
  await update(getDatabaseReference(`info/project/${project}`), data);
}

export async function deleteProjectInfo(project: string) {
  await remove(getDatabaseReference(`info/project/${project}`));
}

// Payment Info
export async function addNewPaymentInfo(data: {
  type: string;
  project: string;
  details: string;
}) {
  const path = `info/payment/${
    data.type === 'cellAccount' ? 'cell' : data.type
  }`;

  await update(getDatabaseReference(path), {
    [`${data.details}_${data.project}`]: data.project,
  });
}

export async function deletePaymentInfo(type: string, key: string) {
  await remove(getDatabaseReference(`info/payment/${type}/${key}`));
}

//Callback
export async function updateCallback(
  project: string,
  key: string,
  data: object,
) {
  await set(getDatabaseReference(`callback/${project}/${key}`), data);
}

export async function deleteCallback(project: string, key: string) {
  await remove(getDatabaseReference(`callback/${project}/${key}`));
}

// Forms
export async function updateForm(
  type: 'offer' | 'quote' | 'contact',
  key: string,
  data: object,
) {
  await update(getDatabaseReference(`forms/${type}/${key}`), data);
}

export async function deleteForm(
  type: 'offer' | 'quote' | 'contact',
  key: string,
) {
  await remove(getDatabaseReference(`forms/${type}/${key}`));
}

// Ledger
export async function updateLedgerTransaction(
  year: string,
  month: string,
  date: string,
  id: string,
  data: object,
) {
  await set(
    getDatabaseReference(`ledger/transaction/${year}/${month}/${date}/${id}`),
    data,
  );
}

export async function deleteLedgerTransaction(
  year: string,
  month: string,
  date: string,
  id: string,
) {
  await remove(
    getDatabaseReference(`ledger/transaction/${year}/${month}/${date}/${id}`),
  );
}

// Inventory
export async function setInventoryItem(item: string, count: number) {
  await set(getDatabaseReference(`company/inventory/${item}`), count);
}

export async function deleteInventoryItem(item: string) {
  await remove(getDatabaseReference(`company/inventory/${item}`));
}

// User Info
export async function updateUserInfo(uid: string, data: object) {
  await update(getDatabaseReference(`info/user/${uid}`), data);
}
