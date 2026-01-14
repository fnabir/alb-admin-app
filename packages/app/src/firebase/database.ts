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

export function getDatabaseReference(path: string): DatabaseReference {
  return ref(database, path);
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
