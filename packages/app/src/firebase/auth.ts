import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth } from './client';

/**
 * Sign in with email and password
 */
export async function signIn(
  email: string,
  password: string,
): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Sign up with email and password
 */
export async function signUp(
  email: string,
  password: string,
): Promise<UserCredential> {
  return createUserWithEmailAndPassword(auth, email, password);
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  return firebaseSignOut(auth);
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChanged(callback: (user: User | null) => void) {
  return auth.onAuthStateChanged(callback);
}
