import { signOut as firebaseSignOut, User } from 'firebase/auth';
import { auth } from './client';

export async function signOut(): Promise<void> {
  return firebaseSignOut(auth);
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export function onAuthStateChanged(callback: (user: User | null) => void) {
  return auth.onAuthStateChanged(callback);
}
