import { initializeApp, getApps } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';
import { getFirebaseConfig } from './config';

// Initialize Firebase once
const config = getFirebaseConfig();
const app = getApps().length === 0 ? initializeApp(config) : getApps()[0];

// Export ready-to-use instances
export const auth: Auth = getAuth(app);
export const database: Database = getDatabase(app);
