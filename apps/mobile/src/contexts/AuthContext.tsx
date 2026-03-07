import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useObjectVal } from 'react-firebase-hooks/database';
import { auth, getDatabaseReference } from '@repo/app';
import { User } from 'firebase/auth';
import { useRouter, useSegments } from 'expo-router';
import { toast } from '@repo/ui';

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

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  userData: undefined,
  isAdmin: false,
  loading: true,
  error: undefined,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, userLoading, userError] = useAuthState(auth);
  const router = useRouter();
  const segments = useSegments();

  const userDataRef = useMemo(
    () => (user ? getDatabaseReference(`info/user/${user.uid}`) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user?.uid],
  );

  const [userData, userDataLoading, userDataError] =
    useObjectVal<UserData>(userDataRef);

  const isAdmin = userData?.role === 'admin';
  const loading = userLoading || userDataLoading;
  const error = userError || userDataError;

  const accessDeniedRef = useRef(false);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user) {
      if (!inAuthGroup) {
        router.replace('/login');
      }
      return;
    }

    // Still waiting for userData from DB
    if (userData === undefined) return;

    const hasAccess = userData?.appAccess ?? true;

    if (!hasAccess && !accessDeniedRef.current) {
      accessDeniedRef.current = true;

      auth.signOut();

      toast.error(
        'Access Denied',
        'You do not have permission to access this app.',
      );
    }

    if (hasAccess) {
      accessDeniedRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userData, loading]);

  return (
    <AuthContext.Provider value={{ user, userData, isAdmin, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
