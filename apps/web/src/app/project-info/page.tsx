'use client';

import { useBreadcrumbs } from '@/components/BreadcrumbContext';
import { getDatabaseReference } from '@repo/app';
import {
  Button,
  EmptyUI,
  ErrorUI,
  ProjectInfoCard,
  ProjectInfoDialog,
} from '@repo/ui';
import { useEffect, useMemo } from 'react';
import { useList } from 'react-firebase-hooks/database';
import { MdAdd } from 'react-icons/md';
import { Loading } from '@/components/Loading';

export default function ProjectInfo() {
  const { setItems } = useBreadcrumbs();

  useEffect(() => {
    document.title = 'Project Info | ALB Admin';
  }, []);

  useEffect(() => {
    setItems([{ label: 'Home', href: '/' }, { label: 'Project Info' }]);
  }, [setItems]);

  const [data, loading, error] = useList(getDatabaseReference('info/project'));

  const projects = useMemo(() => {
    if (!data) return [];
    const map = new Map<string, (typeof data)[number]>();

    for (const snap of data) {
      map.set(snap.key!, snap);
    }

    return Array.from(map.values());
  }, [data]);

  return (
    <div className="size-full flex flex-col space-y-2">
      <div className="px-2 md:px-3 lg:px-4">
        <ProjectInfoDialog>
          <Button
            icon={MdAdd}
            label="Add New Project"
            ariaLabel="Add Project Button"
          />
        </ProjectInfoDialog>
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
        <div className="flex-1 grid gird-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 lg:gap-3 overflow-y-auto px-2 md:px-3 lg:px-4">
          {projects.map((item) => {
            return (
              <ProjectInfoCard key={item.key} id={item.key} val={item.val()} />
            );
          })}
        </div>
      )}
    </div>
  );
}
