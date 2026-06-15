import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Button, EmptyUI, ErrorUI, FormCard, OfferFormDialog } from '@repo/ui';
import { DataSnapshot } from 'firebase/database';
import { useMemo, useState } from 'react';
import { useList } from 'react-firebase-hooks/database';
import { FormType, FormVal, getDatabaseReference } from '@repo/app';
import { HeaderBar } from '@/src/components/HeaderBar';
import { Loading } from '@/src/components/Loading';
import { ThemedIcon } from '@/src/components/ThemedIcon';

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

export default function FormsScreen() {
  const [filter, setFilter] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);

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
    if (offersLoading || contactsLoading || quoteLoading) return null;

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

    return {
      list: list.sort((a, b) => b.val.date.localeCompare(a.val.date)),
      counts: {
        offer: offerList.length,
        contact: contactList.length,
        quote: quoteList.length,
      },
      totalCount: offerList.length + contactList.length + quoteList.length,
    };
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
    <>
      <SafeAreaView className="flex-1 bg-background gap-2">
        <HeaderBar
          title="Forms"
          right={
            <TouchableOpacity
              onPress={() => {
                setOpenDialog(true);
              }}
            >
              <ThemedIcon name="add-circle-outline" size={30} />
            </TouchableOpacity>
          }
        />
        <View className="flex-wrap flex-row gap-1 justify-center">
          <Button
            label={`All (${combinedData?.totalCount ?? 0})`}
            onPress={() => setFilter('')}
            variant={filter === '' ? 'accent' : 'outline'}
            disabled={loading || !combinedData?.totalCount}
            textClassName="!text-base"
          />
          <Button
            label={`Offers (${combinedData?.counts.offer ?? 0})`}
            onPress={() => setFilter('offer')}
            variant={filter === 'offer' ? 'accent' : 'outline'}
            disabled={loading || !combinedData?.counts.offer}
            textClassName="!text-base"
          />
          <Button
            label={`Contacts (${combinedData?.counts.contact ?? 0})`}
            onPress={() => setFilter('contact')}
            variant={filter === 'contact' ? 'accent' : 'outline'}
            disabled={loading || !combinedData?.counts.contact}
            textClassName="!text-base"
          />
          <Button
            label={`Quotes (${combinedData?.counts.quote ?? 0})`}
            onPress={() => setFilter('quote')}
            variant={filter === 'quote' ? 'accent' : 'outline'}
            disabled={loading || !combinedData?.counts.quote}
            textClassName="!text-base"
          />
        </View>
        <ScrollView
          className="bg-background py-2"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <Loading />
            </View>
          ) : error ? (
            <View className="flex-1 items-center justify-center">
              <ErrorUI error={error} />
            </View>
          ) : !combinedData?.list.length ? (
            <View className="flex-1 items-center justify-center">
              <EmptyUI />
            </View>
          ) : (
            <View className="flex-col gap-2">
              <>
                {combinedData.list.map((item) => {
                  return (
                    <FormCard
                      key={item.id}
                      id={item.id}
                      type={item.type}
                      val={item.val}
                    >
                      {item.type === 'offer' ? (
                        <Text>Offer Details</Text>
                      ) : item.type === 'contact' ? (
                        <Text>Contact Details</Text>
                      ) : (
                        <Text>Quote Details</Text>
                      )}
                    </FormCard>
                  );
                })}
              </>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      <OfferFormDialog open={openDialog} onOpenChange={setOpenDialog} />
    </>
  );
}
