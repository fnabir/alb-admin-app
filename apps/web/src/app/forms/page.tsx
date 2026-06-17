'use client';

import { useBreadcrumbs } from '@/components/BreadcrumbContext';
import { Loading } from '@/components/Loading';
import {
  formFilterOptions,
  getDatabaseReference,
  usePersistedState,
  FormType,
  FormVal,
} from '@repo/app';
import {
  Button,
  EmptyUI,
  ErrorUI,
  FormCard,
  OfferFormDialog,
  Select,
  WebsiteFormDialog,
} from '@repo/ui';
import { DataSnapshot } from 'firebase/database';
import { useEffect, useMemo } from 'react';
import { useList } from 'react-firebase-hooks/database';
import { MdAdd } from 'react-icons/md';
import DeleteFormDialog from './DeleteFormDialog';

type FormItem = {
  id: string;
  val: FormVal;
  type: FormType;
};

function mapSnapshots(
  snaps: DataSnapshot[] | undefined,
  type: FormType,
): FormItem[] {
  if (!snaps?.length) return [];
  const map = new Map<string, FormItem>();

  for (const snap of snaps) {
    if (!snap.key) continue;
    map.set(snap.key, {
      id: snap.key,
      val: snap.val() as FormVal,
      type,
    });
  }

  return Array.from(map.values());
}

export default function Forms() {
  const { setItems } = useBreadcrumbs();

  useEffect(() => {
    setItems([{ label: 'Home', href: '/' }, { label: 'Forms' }]);
  }, [setItems]);

  const [filter, setFilter] = usePersistedState<string>('forms-filter', '');

  const [offers, offersLoading, offerError] = useList(
    getDatabaseReference('forms/offer'),
  );

  const [contacts, contactsLoading, contactsError] = useList(
    getDatabaseReference('forms/contact'),
  );

  const [quote, quoteLoading, quoteError] = useList(
    getDatabaseReference('forms/quote'),
  );

  const loading = offersLoading || contactsLoading || quoteLoading;
  const error = offerError || contactsError || quoteError;

  const combinedData = useMemo(() => {
    if (offersLoading || contactsLoading || quoteLoading) return [];

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

    return list.sort((a, b) => b.val.date.localeCompare(a.val.date));
  }, [
    offersLoading,
    contactsLoading,
    quoteLoading,
    offers,
    contacts,
    quote,
    filter,
  ]);

  return (
    <div className="size-full flex flex-col space-y-2">
      <div className="flex items-center space-x-2 px-2 md:px-3 lg:px-4">
        <span>Show</span>
        <Select
          value={filter}
          options={formFilterOptions}
          onChange={setFilter}
          placeholder="All"
          className="max-w-36"
        />
        <OfferFormDialog>
          <Button icon={MdAdd} label="Add Offer" />
        </OfferFormDialog>
      </div>
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loading isFullScreen={false} />
        </div>
      ) : error ? (
        <ErrorUI error={error} />
      ) : !combinedData?.length ? (
        <EmptyUI
          text={filter ? `No ${filter} form found.` : 'No Record Found.'}
        />
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3 overflow-y-auto px-2 md:px-3 lg:px-4 content-start">
          {combinedData.map((item) => (
            <FormCard
              key={item.id}
              id={item.id}
              type={item.type}
              val={item.val}
            >
              {item.type === 'offer' ? (
                <OfferFormDialog id={item.id} val={item.val}>
                  <div className="px-2 py-0.25 bg-primary rounded-full cursor-pointer">
                    <span>Edit</span>
                  </div>
                </OfferFormDialog>
              ) : item.type === 'contact' || item.type === 'quote' ? (
                <WebsiteFormDialog type={item.type} id={item.id} val={item.val}>
                  <div className="px-2 py-0.25 bg-primary rounded-full cursor-pointer">
                    <span>Edit</span>
                  </div>
                </WebsiteFormDialog>
              ) : null}

              <DeleteFormDialog
                type={item.type}
                id={item.id}
                name={item.val.name}
              >
                <div className="px-2 py-0.25 bg-primary rounded-full cursor-pointer">
                  <span>Delete</span>
                </div>
              </DeleteFormDialog>
            </FormCard>
          ))}
        </div>
      )}
    </div>
  );
}
