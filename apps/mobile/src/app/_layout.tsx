import { Slot, usePathname } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { LoadingProvider, useLoading } from '../contexts/LoadingContext';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { AuthGuard } from '../components/AuthGuard';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import '../../global.css';
import { useEffect } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ThemeWrapper } from '../components/ThemeWrapper';
import { ToastProvider } from '@repo/ui';
import ThemedStatusBar from '../components/ThemedStatusBar';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito: require('../../assets/fonts/NunitoSans-VariableFont.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <ThemeWrapper>
        <LoadingProvider>
          <AuthProvider>
            <AuthGuard>
              <ThemedStatusBar />
              <Slot />
            </AuthGuard>
            <LoadingOverlay />
          </AuthProvider>
        </LoadingProvider>
        <ToastProvider />
      </ThemeWrapper>
    </ThemeProvider>
  );
}
