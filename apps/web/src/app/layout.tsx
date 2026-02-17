import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LoadingProvider } from '@repo/app';
import { AuthProvider } from '@/contexts/AuthContext';
import { LoadingBar } from '@/components/LoadingBar';
import { RootLayoutContent } from '@/components/RootLayoutContent';
import { ToastProvider } from '@repo/ui';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: {
    default: 'ALB Admin',
    template: '%s | ALB Admin',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider />
          <LoadingProvider>
            <AuthProvider>
              <LoadingBar />
              <RootLayoutContent>{children}</RootLayoutContent>
            </AuthProvider>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
