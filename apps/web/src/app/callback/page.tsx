'use client';

import { useBreadcrumbs } from '@/components/BreadcrumbContext';
import { Loading } from '@/components/Loading';
import { LoadingLink } from '@/components/LoadingLink';
import { getDatabaseReference } from '@repo/app';
import { Button, CallbackTotalCard, EmptyUI, ErrorUI } from '@repo/ui';
import { useEffect } from 'react';
import { useList } from 'react-firebase-hooks/database';
import UpdateCallbackDialog from './updateCallbackDialog';
import { MdAdd } from 'react-icons/md';

export default function Callback() {
  const { setItems } = useBreadcrumbs();

  useEffect(() => {
    document.title = 'Callback | ALB Admin';
  }, []);

  useEffect(() => {
    setItems([{ label: 'Home', href: '/' }, { label: 'Callback' }]);
  }, [setItems]);

  const [data, loading, error] = useList(getDatabaseReference('callback'));

  return (
    <div className="size-full flex flex-col space-y-2">
      <div className="flex items-center space-x-2 px-2 md:px-3 lg:px-4">
        <UpdateCallbackDialog>
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
          {data.map((item) => {
            return (
              <LoadingLink key={item.key} href={`callback/${item.key}`}>
                <CallbackTotalCard project={item.key!} count={item.size} />
              </LoadingLink>
            );
          })}
        </div>
      )}
    </div>
  );
}
