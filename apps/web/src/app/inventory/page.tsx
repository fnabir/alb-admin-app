'use client';

import { useBreadcrumbs } from '@/components/BreadcrumbContext';
import { Loading } from '@/components/Loading';
import { getDatabaseReference } from '@repo/app';
import { Button, InventoryCard, InventoryDialog } from '@repo/ui';
import { useEffect, useMemo } from 'react';
import { useObject } from 'react-firebase-hooks/database';
import { MdAdd, MdOutlineInfo } from 'react-icons/md';

export default function Inventory() {
  const { setItems } = useBreadcrumbs();

  useEffect(() => {
    setItems([{ label: 'Home', href: '/' }, { label: 'Inventory' }]);
  }, [setItems]);

  const [data, loading, error] = useObject(
    getDatabaseReference('company/inventory'),
  );

  const inventoryList = useMemo(() => {
    if (!data) return [];

    return Object.entries((data.val() as Record<string, number>) ?? {}).map(
      ([name, count]) => ({
        name,
        count,
      }),
    );
  }, [data]);

  return (
    <div className="flex h-full w-full flex-col space-y-2">
      <div className="shrink-0 px-2 md:px-3 lg:px-4">
        <InventoryDialog>
          <Button icon={MdAdd} label="Add" ariaLabel="Add" />
        </InventoryDialog>
      </div>
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loading isFullScreen={false} />
        </div>
      ) : error ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-lg">
          <MdOutlineInfo className="size-16" />
          {error.message}
        </div>
      ) : !data || inventoryList.length == 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-lg">
          <MdOutlineInfo className="size-16" />
          No Record Found
        </div>
      ) : (
        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-3 overflow-y-auto px-2 md:px-3 lg:px-4 content-start">
          {inventoryList.map((item) => (
            <InventoryCard
              key={item.name}
              item={item.name}
              count={item.count}
            />
          ))}
        </div>
      )}
    </div>
  );
}
