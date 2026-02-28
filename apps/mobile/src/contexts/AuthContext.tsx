import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useObjectVal } from 'react-firebase-hooks/database';
import { auth, getDatabaseReference } from '@repo/app';
import { User } from 'firebase/auth';
import { useRouter, useSegments } from 'expo-router';

interface UserData {
  role?: string;
  name?: string;
  title?: string;
  phone?: string;
  appAccess?: boolean;
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

  const userDataRef = useMemo(
    () => (user ? getDatabaseReference(`info/user/${user.uid}`) : null),
    [user],
  );
  const [userData, userDataLoading, userDataError] =
    useObjectVal<UserData>(userDataRef);

  const isAdmin = userData?.role === 'admin';

  const hasAccess = userData?.appAccess ?? true;
  if (user && !hasAccess) {
    auth.signOut();
  }

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
