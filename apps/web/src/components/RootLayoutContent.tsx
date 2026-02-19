'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { useNavigationLoader } from '@/hooks/useNavigationLoader';
import Header from './Header';
import Footer from './Footer';
import { BreadcrumbProvider } from './BreadcrumbContext';
import { Loading } from './Loading';
import { MdOutlineInfo } from 'react-icons/md';
import { Button, LoadingLink } from '@repo/ui';
import { useState } from 'react';
import { SidebarContent } from './SidebarContent';
import { MobileSidebar } from './MobileSidebar';

const PUBLIC_ROUTES = ['/login', '/forgot-password'];

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading, isUnauthorized } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Enable navigation loading
  useNavigationLoader();

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // Show loading screen during initial auth check
  if (loading || (!isPublicRoute && !user)) return <Loading />;

  if (isUnauthorized)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background space-y-2">
        <MdOutlineInfo className="size-16" />
        Not authorized to access this page.
        <LoadingLink href="./">
          <Button label={'Go to Home'} className="mt-2" />
        </LoadingLink>
      </div>
    );

  // Public routes (login, signup) - simple layout
  if (isPublicRoute || !user) {
    return <div className="h-screen">{children}</div>;
  }

  // Protected routes - full app layout
  return (
    <BreadcrumbProvider>
      <div className="flex h-screen bg-background">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex basis-[13%] h-full bg-card flex-col">
          <SidebarContent />
        </aside>

        {/* Mobile Drawer */}
        <MobileSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex flex-1 flex-col h-full py-2 lg:py-3 space-y-2">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <div className="flex-1 overflow-hidden">{children}</div>
          <Footer />
        </div>
      </div>
    </BreadcrumbProvider>
  );
}
