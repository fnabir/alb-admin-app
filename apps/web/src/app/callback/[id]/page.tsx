'use client';

import { useBreadcrumbs } from '@/components/BreadcrumbContext';
import { Loading } from '@/components/Loading';
import { getDatabaseReference } from '@repo/app';
import {
  Button,
  CallbackDialog,
  CallbackProjectCard,
  CallbackValType,
  EmptyUI,
  ErrorUI,
} from '@repo/ui';
import { useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useList } from 'react-firebase-hooks/database';
import { MdAdd } from 'react-icons/md';

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
    const map = new Map<string, CallbackValType>();

    for (const snap of data) {
      map.set(snap.key!, snap.val());
    }

    return Array.from(map.entries());
  }, [data]);

  return (
    <div className="size-full flex flex-col space-y-2">
      <div className="flex items-center space-x-2 px-2 md:px-3 lg:px-4">
        <CallbackDialog project={project}>
          <Button label="Add Callback" icon={MdAdd} />
        </CallbackDialog>
      </div>
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loading isFullScreen={false} />
        </div>
      ) : error ? (
        <ErrorUI error={error} />
      ) : !callbacks?.length ? (
        <EmptyUI />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-3 mx-4">
          {callbacks
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([key, val]) => (
              <CallbackProjectCard
                key={key}
                project={project}
                val={val}
                id={key}
              />
            ))}
        </div>
      )}
    </div>
  );
}
