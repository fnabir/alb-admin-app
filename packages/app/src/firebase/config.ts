export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export function getFirebaseConfig(): FirebaseConfig {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const databaseURL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const messagingSenderId =
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

  if (
    !apiKey ||
    !authDomain ||
    !databaseURL ||
    !projectId ||
    !messagingSenderId ||
    !appId
  ) {
    throw new Error('Missing Firebase configuration!');
  }

  return {
    apiKey,
    authDomain,
    databaseURL,
    projectId,
    messagingSenderId,
    appId,
    measurementId,
  };
}
