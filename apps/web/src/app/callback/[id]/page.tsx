'use client';

import { useBreadcrumbs } from '@/components/BreadcrumbContext';
import { Loading } from '@/components/Loading';
import { getDatabaseReference } from '@repo/app';
import { Button, CallbackCard, EmptyUI, ErrorUI } from '@repo/ui';
import { useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useList } from 'react-firebase-hooks/database';
import UpdateCallbackDialog from '../updateCallbackDialog';
import { MdAdd, MdEdit } from 'react-icons/md';
import DeleteCallbackDialog from './deleteCallbackDialog';

export default function CallbackProject() {
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

  const callbacks = useMemo(() => {
    if (!data) return [];
    const map = new Map<string, (typeof data)[number]>();

    for (const snap of data) {
      map.set(snap.key!, snap);
    }

    return Array.from(map.values());
  }, [data]);

  return (
    <div className="size-full flex flex-col space-y-2">
      <div className="flex items-center space-x-2 px-2 md:px-3 lg:px-4">
        <UpdateCallbackDialog project={project}>
          <Button label="Add Callback" icon={MdAdd} />
        </UpdateCallbackDialog>
      </div>
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loading isFullScreen={false} />
        </div>
      ) : error ? (
        <ErrorUI error={error} />
      ) : !data?.length ? (
        <EmptyUI />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-3 mx-4">
          {callbacks
            .sort((a, b) => b.key!.localeCompare(a.key!))
            .map((item) => {
              return (
                <CallbackCard key={item.key!} project={item.key!} data={item}>
                  <UpdateCallbackDialog project={project} data={item}>
                    <Button icon={MdEdit} />
                  </UpdateCallbackDialog>
                  <DeleteCallbackDialog project={project} data={item} />
                </CallbackCard>
              );
            })}
        </div>
      )}
    </div>
  );
}
