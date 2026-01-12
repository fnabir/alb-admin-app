'use client';

import { useBreadcrumbs } from '@/components/BreadcrumbContext';
import { Loading } from '@/components/Loading';
import { getDatabaseReference } from '@repo/app';
import { Card } from '@repo/ui';
import { useEffect } from 'react';
import { useList } from 'react-firebase-hooks/database';
import { MdOutlineInfo } from 'react-icons/md';

export default function Project() {
  const { setItems } = useBreadcrumbs();

  useEffect(() => {
    document.title = 'Callback | ALB Admin';
  }, []);

  useEffect(() => {
    setItems([{ label: 'Home', href: '/' }, { label: 'Callback' }]);
  }, [setItems]);

  const [data, loading, error] = useList(getDatabaseReference('callback'));

  return (
    <div className="w-full">
      {loading ? (
        <div className="h-full flex items-center justify-center">
          <Loading isFullScreen={false} />{' '}
        </div>
      ) : error ? (
        <div className="h-full flex flex-col items-center justify-center gap-2 text-lg">
          <MdOutlineInfo className="size-16" />
          {error.message}
        </div>
      ) : !data || data.length == 0 ? (
        <div className="h-full flex flex-col items-center justify-center gap-2 text-lg">
          <MdOutlineInfo className="size-16" />
          No Record Found
        </div>
      ) : (
        <div className="space-y-2 mx-4">
          {data.map((item) => {
            return (
              <Card
                className="flex hover:border-accent px-4 py-1 font-semibold"
                key={item.key}
              >
                <div className="flex-1">{item.key}</div>
                <div className="text-xl font-bold">{item.size}</div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
