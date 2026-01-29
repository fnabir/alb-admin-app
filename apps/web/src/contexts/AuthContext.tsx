'use client';

import { createContext, ReactNode, useContext, useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, getDatabaseReference } from '@repo/app';
import { User } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { useObjectVal } from 'react-firebase-hooks/database';

interface UserData {
  name?: string;
  role?: string;
  roll?: number;
  salary?: number;
  title?: string;
}

interface AuthContextType {
  user?: User | null;
  userData?: UserData | null;
  loading: boolean;
  error: Error | undefined;
  isAdmin: boolean;
  isUnauthorized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ['/login', '/forgot-password'];
const ADMIN_ROUTES = ['/staff', '/conveyance'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, userLoading, userError] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();

  // Fetch user data from database when user is authenticated
  const userDataRef = user
    ? getDatabaseReference(`info/user/${user.uid}`)
    : null;
  const [userData, userDataLoading, userDataError] =
    useObjectVal<UserData>(userDataRef);

  // Determine if user is admin
  const isAdmin = userData?.role === 'admin';

  // Combined loading state
  const loading = userLoading || userDataLoading;
  const error = userError || userDataError;

  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  const isUnauthorized = Boolean(!loading && user && isAdminRoute && !isAdmin);

  const hasInitialized = useRef(false);

  // Sync auth state with cookies for middleware
  useEffect(() => {
    if (loading) return;

    if (user) {
      // Set auth cookie when user is authenticated
      user.getIdToken().then((token) => {
        Cookies.set('auth-token', token, { expires: 7 });
      });
    } else {
      // Remove auth cookie when user logs out
      Cookies.remove('auth-token');
    }
  }, [user, loading]);

  // Client-side route protection
  useEffect(() => {
    if (loading) return;

    if (!hasInitialized.current) {
      hasInitialized.current = true;
    }

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    // Redirect to login if not authenticated
    if (!user && !isPublicRoute) {
      router.push('/login');
    }

    // Redirect to home if authenticated user tries to access login
    if (user && isPublicRoute) {
      router.push('/');
    }
  }, [user, loading, pathname, router]);

  return (
    <AuthContext.Provider
      value={{ user, userData, loading, error, isAdmin, isUnauthorized }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
