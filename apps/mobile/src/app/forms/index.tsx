import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView } from 'react-native';
import { Button, EmptyUI, ErrorUI, FormCard } from '@repo/ui';
import { DataSnapshot } from 'firebase/database';
import { useMemo, useState } from 'react';
import { useList } from 'react-firebase-hooks/database';
import { getDatabaseReference } from '@repo/app';
import { HeaderBar } from '@/src/components/HeaderBar';
import { Loading } from '@/src/components/Loading';

type FormItem = {
  snap: DataSnapshot;
  type: 'offer' | 'contact' | 'quote';
  date: string;
  name: string;
};

export default function FormsScreen() {
  const [filter, setFilter] = useState<string>('');

  const [offers, offersLoading, offerError] = useList(
    getDatabaseReference('forms/offer'),
  );

  const [contacts, contactsLoading, contactsError] = useList(
    getDatabaseReference('forms/contact'),
  );

  const [quote, quoteLoading, quoteError] = useList(
    getDatabaseReference('forms/quote'),
  );

  const mapSnapshots = (
    snaps: DataSnapshot[] | undefined,
    type: FormItem['type'],
  ): FormItem[] => {
    if (!snaps?.length) return [];

    const map = new Map<string, FormItem>();

    for (const snap of snaps) {
      if (!snap.key) continue;

      const val = snap.val();

      map.set(snap.key, {
        snap,
        type,
        name: val.name,
        date: val.date,
      });
    }

    return Array.from(map.values());
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

    const counts = {
      offer: offerList.length,
      contact: contactList.length,
      quote: quoteList.length,
    };

    const totalCount = offerList.length + contactList.length + quoteList.length;

    return { list, counts, totalCount };
  }, [offers, contacts, quote, filter]);

  const loading = offersLoading || contactsLoading || quoteLoading;
  const error = offerError || contactsError || quoteError;

  return (
    <SafeAreaView className="flex-1 bg-background gap-2">
      <HeaderBar title="Forms" />
      <View className="flex-row gap-1 mx-auto">
        <Button
          label={`All (${combinedData.totalCount})`}
          onPress={() => setFilter('')}
          variant={filter === '' ? 'accent' : 'outline'}
          disabled={loading || !combinedData.totalCount}
        />
        <Button
          label={`Offers (${combinedData.counts.offer})`}
          onPress={() => setFilter('offer')}
          variant={filter === 'offer' ? 'accent' : 'outline'}
          disabled={loading || !combinedData.counts.offer}
        />
        <Button
          label={`Contacts (${combinedData.counts.contact})`}
          onPress={() => setFilter('contact')}
          variant={filter === 'contact' ? 'accent' : 'outline'}
          disabled={loading || !combinedData.counts.contact}
        />
        <Button
          label={`Quotes (${combinedData.counts.quote})`}
          onPress={() => setFilter('quote')}
          variant={filter === 'quote' ? 'accent' : 'outline'}
          disabled={loading || !combinedData.counts.quote}
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
              {combinedData.list
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((item) => {
                  return (
                    <FormCard
                      key={item.snap.key}
                      type={item.type}
                      data={item.snap}
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
  );
}
