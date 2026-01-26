import {
  ref,
  set,
  get,
  update,
  remove,
  push,
  DatabaseReference,
} from 'firebase/database';
import { database } from './client';
import { getCurrentDate } from '../utils';

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

// Forms
export async function deleteForm(
  type: 'offer' | 'quote' | 'contact',
  key: string,
) {
  await remove(getDatabaseReference(`forms/${type}/${key}`));
}

// Inventory
export async function setInventoryItem(item: string, count: number) {
  await set(getDatabaseReference(`company/inventory/${item}`), count);
}

export async function deleteInventoryItem(item: string) {
  await remove(getDatabaseReference(`company/inventory/${item}`));
}
