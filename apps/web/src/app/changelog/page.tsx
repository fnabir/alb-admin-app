'use client';

import { useBreadcrumbs } from '@/components/BreadcrumbContext';
import { useAuth } from '@/contexts/AuthContext';
import { VersionCard } from '@repo/ui';
import { changelog } from '@repo/ui/src/lib/changelog';
import { useEffect } from 'react';

export default function Changelog() {
  const { setItems } = useBreadcrumbs();
  const { isAdmin } = useAuth();

  useEffect(() => {
    document.title = 'Changelog | ALB Admin';
  }, []);

  useEffect(() => {
    setItems([{ label: 'Home', href: '/' }, { label: 'Changelog' }]);
  }, [setItems]);

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mx-4">
        {Object.keys(changelog).map((version, index) => {
          return (
            <VersionCard key={index} isAdmin={isAdmin} version={version} />
          );
        })}
      </div>
    </div>
  );
}
