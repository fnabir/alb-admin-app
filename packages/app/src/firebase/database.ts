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
import { PaymentInfoForm } from 'src/schemas';

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

// Payment Info
export async function addNewPaymentInfo(data: PaymentInfoForm) {
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
