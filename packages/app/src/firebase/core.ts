import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getFirebaseConfig } from './config';

// Initialize Firebase once
const config = getFirebaseConfig();
export const app =
  getApps().length === 0 ? initializeApp(config) : getApps()[0];

// Export ready-to-use instances
export const database: Database = getDatabase(app);
