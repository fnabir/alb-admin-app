'use client';

import { useBreadcrumbs } from '@/components/BreadcrumbContext';
import { Loading } from '@/components/Loading';
import { LoadingLink } from '@/components/LoadingLink';
import { getDatabaseReference } from '@repo/app';
import { CallbackCard, EmptyUI, ErrorUI } from '@repo/ui';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useList } from 'react-firebase-hooks/database';

export default function Project() {
  const { id } = useParams() as { id: string };
  const project = decodeURIComponent(id);
  const { setItems } = useBreadcrumbs();

  useEffect(() => {
    document.title = `${project} | Callback`;
  }, [project]);

  useEffect(() => {
    setItems([
      { label: 'Home', href: '/' },
      { label: 'Callback', href: '/callback' },
      { label: project },
    ]);
  }, [setItems, project]);

  const [data, loading, error] = useList(
    getDatabaseReference(`callback/${project}`),
  );

  return (
    <div className="size-full">
      {loading ? (
        <div className="h-full flex justify-center">
          <Loading isFullScreen={false} />
        </div>
      ) : error ? (
        <ErrorUI error={error} />
      ) : !data?.length ? (
        <EmptyUI />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-3 mx-4">
          {data
            .sort((a, b) => b.key!.localeCompare(a.key!))
            .map((item) => {
              return (
                <LoadingLink key={item.key} href={`callback/${item.key}`}>
                  <CallbackCard project={item.key!} data={item} />
                </LoadingLink>
              );
            })}
        </div>
      )}
    </div>
  );
}
