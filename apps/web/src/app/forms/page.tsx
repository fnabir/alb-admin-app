'use client';

import { useBreadcrumbs } from '@/components/BreadcrumbContext';
import { Loading } from '@/components/Loading';
import { getDatabaseReference } from '@repo/app';
import { EmptyUI, ErrorUI, FormCard } from '@repo/ui';
import { DataSnapshot } from 'firebase/database';
import { useEffect, useMemo, useState } from 'react';
import { useList } from 'react-firebase-hooks/database';

type FormItem = {
  snap: DataSnapshot;
  type: 'offer' | 'contact' | 'quote';
  date: string;
};

export default function Forms() {
  const { setItems } = useBreadcrumbs();

  useEffect(() => {
    setItems([{ label: 'Home', href: '/' }, { label: 'Forms' }]);
  }, [setItems]);

  const [filter, setFilter] = useState<
    'offer' | 'contact' | 'quote' | undefined
  >();

  const [offers, offersLoading, offerError] = useList(
    getDatabaseReference('offer'),
  );

  const [contacts, contactsLoading, contactsError] = useList(
    getDatabaseReference('forms/contact'),
  );

  const [quote, quoteLoading, quoteError] = useList(
    getDatabaseReference('website/quote'),
  );

  const mapSnapshots = (
    snaps: DataSnapshot[] | undefined,
    type: FormItem['type'],
  ): FormItem[] => {
    if (!snaps) return [];

    return snaps.map((snap) => {
      return {
        snap,
        type,
        date: snap.val().date,
      };
    });
  };

  const combinedData = useMemo(() => {
    const offerList = mapSnapshots(offers, 'offer');
    const contactList = mapSnapshots(contacts, 'contact');
    const quoteList = mapSnapshots(quote, 'quote');

    let list: FormItem[] = [];

    switch (filter) {
      case 'offer':
        list = offerList;
        break;
      case 'contact':
        list = contactList;
        break;
      case 'quote':
        list = quoteList;
        break;
      default:
        list = [...offerList, ...contactList, ...quoteList];
    }

    return list.sort((a, b) => b.date.localeCompare(a.date));
  }, [offers, contacts, quote, filter]);

  const loading = offersLoading || contactsLoading || quoteLoading;
  const error = offerError || contactsError || quoteError;

  return (
    <div className="size-full flex flex-col space-y-2">
      <div className="px-2 md:px-3 lg:px-4"></div>
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loading isFullScreen={false} />
        </div>
      ) : error ? (
        <ErrorUI error={error} />
      ) : !offers?.length && !contacts?.length && !quote?.length ? (
        <EmptyUI />
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3 overflow-y-auto px-2 md:px-3 lg:px-4 content-start">
          {combinedData?.map((item) => (
            <FormCard key={item.snap.key} type={item.type} data={item.snap} />
          ))}
        </div>
      )}
    </div>
  );
}
