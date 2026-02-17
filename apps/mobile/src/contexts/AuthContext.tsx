import { createContext, useContext, useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useObjectVal } from 'react-firebase-hooks/database';
import { auth, database } from '@repo/app';
import { ref } from 'firebase/database';
import { User } from 'firebase/auth';
import { useRouter, useSegments } from 'expo-router';

interface UserData {
  role?: string;
  displayName?: string;
  email?: string;
}

interface AuthContextType {
  user?: User | null;
  userData?: UserData | null;
  isAdmin: boolean;
  loading: boolean;
  error: Error | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, userLoading, userError] = useAuthState(auth);
  const router = useRouter();
  const segments = useSegments();
  const hasInitialized = useRef(false);

  // Fetch user data from database when user is authenticated
  const userDataRef = user ? ref(database, `info/user/${user.uid}`) : null;
  const [userData, userDataLoading, userDataError] =
    useObjectVal<UserData>(userDataRef);

  // Determine if user is admin
  const isAdmin = userData?.role === 'admin';

  // Combined loading state
  const loading = userLoading || userDataLoading;
  const error = userError || userDataError;

  // Route protection
  useEffect(() => {
    if (loading) return;

    if (!hasInitialized.current) {
      hasInitialized.current = true;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // Redirect to main app if authenticated
      router.replace('/(tabs)');
    }
  }, [user, loading, segments, router]);

  return (
    <AuthContext.Provider value={{ user, userData, isAdmin, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
