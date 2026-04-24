import { Badge } from '../badge';
import { Card } from '../Card';
import { FormCardProps } from './types';
import { format, parseISO } from 'date-fns';
import { Text, View } from 'react-native';

export function FormCard({ data, children, type }: FormCardProps) {
  const val = data.val();

  return (
    <Card>
      <View className="flex-row flex-wrap items-center justify-center gap-2">
        <Badge label={format(parseISO(val.date), 'dd MMM yyyy hh:mm a')} />
        <Badge label={type} />
        {val.status && <Badge label={val.status} variant="success" />}
      </View>
      <View className="pt-1 flex-auto grid grid-cols-[minmax(auto,120px)_1fr]">
        <Text className="py-1 border-b-2 border-border text-primary">
          {`Full Name: ${val.name}`}
        </Text>

        {val?.contact && (
          <Text className="py-1 border-b-2 border-border text-primary">
            {`Contact: ${val.contact}`}
          </Text>
        )}

        {val?.address && (
          <Text className="py-1 border-b-2 border-border text-primary">
            {`Address: ${val.address}`}
          </Text>
        )}

        {val?.address && (
          <Text className="py-1 border-b-2 border-border text-primary">
            {`Product: ${`${val?.product} ${val?.unit && `(${val?.unit})`} - ${val?.work}`}`}
          </Text>
        )}

        {val.person && (
          <Text
            className={`py-1 text-primary ${val?.floor && 'border-b-2 border-border'}`}
          >
            {`Person/Load: ${val.person}`}
          </Text>
        )}

        {val.floor && (
          <Text
            className={`py-1 text-primary ${val?.note && 'border-b-2 border-border'}`}
          >
            {`Floor/Stop: ${val.floor}`}
          </Text>
        )}

        {val?.note && (
          <Text className="py-1 whitespace-pre-wrap wrap-break-word text-primary">
            {`Note: ${val.note}`}
          </Text>
        )}
      </View>
    </Card>
  );
}
