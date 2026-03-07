import { Slot } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { LoadingProvider } from '../contexts/LoadingContext';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { AuthGuard } from '../components/AuthGuard';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import '../../global.css';
import { useEffect } from 'react';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { ThemeWrapper } from '../components/ThemeWrapper';
import { ToastProvider } from '@repo/ui';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito: require('../../assets/fonts/NunitoSans-VariableFont.ttf'),
  });

  const { colorScheme } = useTheme();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <ThemeWrapper>
        <StatusBar
          style={colorScheme === 'dark' ? 'light' : 'dark'}
          translucent
          backgroundColor="transparent"
        />
        <LoadingProvider>
          <AuthProvider>
            <AuthGuard>
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
