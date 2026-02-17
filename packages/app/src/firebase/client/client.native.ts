import * as firebaseAuth from 'firebase/auth';
import { initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { app } from '../core';

const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

export const auth = initializeAuth(app, {
  persistence: reactNativePersistence(AsyncStorage),
});
