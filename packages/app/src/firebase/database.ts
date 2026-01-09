import {
  ref,
  set,
  get,
  update,
  remove,
  onValue,
  push,
  query,
  orderByChild,
  equalTo,
  limitToFirst,
  DatabaseReference,
} from 'firebase/database';
import { database } from './client';

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

/**
 * Write data to a specific path
 */
export async function writeData(path: string, data: any): Promise<void> {
  const dataRef = ref(database, path);
  await set(dataRef, data);
}

/**
 * Read data from a specific path
 */
export async function readData<T = any>(path: string): Promise<T | null> {
  const dataRef = ref(database, path);
  const snapshot = await get(dataRef);

  if (snapshot.exists()) {
    return snapshot.val() as T;
  }
  return null;
}

/**
 * Update specific fields at a path
 */
export async function updateData(path: string, updates: any): Promise<void> {
  const dataRef = ref(database, path);
  await update(dataRef, updates);
}

/**
 * Delete data at a specific path
 */
export async function deleteData(path: string): Promise<void> {
  const dataRef = ref(database, path);
  await remove(dataRef);
}

/**
 * Push new data (generates unique key)
 */
export async function pushData(path: string, data: any): Promise<string> {
  const dataRef = ref(database, path);
  const newRef = push(dataRef);
  await set(newRef, data);
  return newRef.key!;
}

/**
 * Listen to real-time updates at a path
 */
export function onDataChange<T = any>(
  path: string,
  callback: (data: T | null) => void,
): () => void {
  const dataRef = ref(database, path);

  const unsubscribe = onValue(dataRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() as T);
    } else {
      callback(null);
    }
  });

  return unsubscribe;
}

/**
 * Query data with filters
 */
export async function queryData<T = any>(
  path: string,
  orderBy: string,
  equalToValue?: string | number | boolean,
  limitCount?: number,
): Promise<T[]> {
  const dataRef = ref(database, path);

  let dataQuery = query(dataRef, orderByChild(orderBy));

  if (equalToValue !== undefined) {
    dataQuery = query(dataQuery, equalTo(equalToValue));
  }

  if (limitCount) {
    dataQuery = query(dataQuery, limitToFirst(limitCount));
  }

  const snapshot = await get(dataQuery);

  if (snapshot.exists()) {
    const results: T[] = [];
    snapshot.forEach((childSnapshot) => {
      results.push(childSnapshot.val() as T);
    });
    return results;
  }

  return [];
}

/**
 * Get data once (no real-time updates)
 */
export async function getDataOnce<T = any>(path: string): Promise<T | null> {
  return readData<T>(path);
}

/**
 * Check if data exists at path
 */
export async function dataExists(path: string): Promise<boolean> {
  const dataRef = ref(database, path);
  const snapshot = await get(dataRef);
  return snapshot.exists();
}
