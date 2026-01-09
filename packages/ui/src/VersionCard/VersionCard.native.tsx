import { Text, View } from 'react-native';
import { Card } from '../Card';
import { format } from 'date-fns';
import { changelog } from '../lib/changelog';
import { VersionCardProps } from './types';

export function VersionCard({ version, isAdmin }: VersionCardProps) {
  const log = changelog[version] ?? null;
  const date = log?.date;

  const filteredDetails =
    log?.details.filter((detail) => {
      return detail.startsWith('[ADMIN]') ? isAdmin : true;
    }) ?? [];

  function renderDetail(detail: string, index: number) {
    const cleanDetail = detail.replace('[ADMIN]', '').trim();

    const tagMatch = cleanDetail.match(/^\[(.*?)\]/);
    const tag = tagMatch ? tagMatch[1] : null;

    const message = tagMatch
      ? cleanDetail.replace(tagMatch[0], '').trim()
      : cleanDetail;

    return (
      <View key={index} className="w-full flex flex-row py-1 space-x-2">
        {tag && (
          <Text
            className={`font-semibold ${
              tag === 'FEATURE'
                ? 'text-green-500'
                : tag === 'UPDATE'
                ? 'text-sky-500'
                : tag === 'FIX'
                ? 'text-red-500'
                : 'text-gray-500'
            }`}
          >
            [{tag}]
          </Text>
        )}

        <Text className="text-primary">{message}</Text>
      </View>
    );
  }

  return (
    <Card className="flex items-center">
      <Text className="text-lg text-primary">VERSION</Text>
      <Text className="text-3xl font-mono text-accent">{version}</Text>
      {date && (
        <Text className="text-muted text-center">
          {format(new Date(date), 'dd MMMM yyyy')}
        </Text>
      )}
      <View className="w-full h-[1px] bg-muted my-3" />
      {filteredDetails.length > 0 ? (
        filteredDetails.map((detail, index) => renderDetail(detail, index))
      ) : (
        <Text className="py-1">No changelog available for this version.</Text>
      )}
    </Card>
  );
}
