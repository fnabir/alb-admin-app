import { Card } from '../Card';
import { FormCardProps } from './types';
import { format, parseISO } from 'date-fns';
import { Text, View } from 'react-native';

export function FormCard({ data, children, type }: FormCardProps) {
  const val = data.val();

  return (
    <Card className={`hover:border-accent text-primary`}>
      <View className="flex flex-wrap items-center gap-2 font-semibold text-background">
        <Text className="px-2 py-0.25 bg-primary rounded-full">
          {format(parseISO(val.date), 'dd MMM yyyy')}
        </Text>
        <Text className="px-2 py-0.25 bg-primary rounded-full capitalize">
          {type}
        </Text>
        {val.status && (
          <Text className="px-2 py-0.25 bg-primary rounded-full">
            {val.status}
          </Text>
        )}
      </View>
      <View className="pt-1 flex-auto grid grid-cols-[minmax(auto,120px)_1fr]">
        <Text className="py-1 border-b-2 border-border">Full Name:</Text>
        <Text className="py-1 border-b-2 border-border">{val.name}</Text>

        {val?.contact && (
          <>
            <Text className="py-1 border-b-2 border-border">Contact:</Text>
            <Text className="py-1 border-b-2 border-border">{val.contact}</Text>
          </>
        )}
        {val?.address && (
          <>
            <Text className="py-1 border-b-2 border-border">Address:</Text>
            <Text className="py-1 border-b-2 border-border">{val.address}</Text>
          </>
        )}
        <Text
          className={`py-1 ${
            (val?.person || val?.floor) && 'border-b-2 border-border'
          }`}
        >
          Product:
        </Text>
        <Text
          className={`py-1 ${
            (val?.person || val?.floor) && 'border-b-2 border-border'
          }`}
        >{`${val?.product} ${val?.unit && `(${val?.unit})`} - ${val?.work}`}</Text>

        {val.person && (
          <Text className={`py-1 ${val?.floor && 'border-b-2 border-border'}`}>
            Person/Load:
          </Text>
        )}
        {val?.person && (
          <Text className={`py-1 ${val?.floor && 'border-b-2 border-border'}`}>
            {val?.person}
          </Text>
        )}

        {val.floor && (
          <Text className={`py-1 ${val?.note && 'border-b-2 border-border '}`}>
            Floor/Stop:
          </Text>
        )}
        {val.floor && (
          <Text className={`py-1 ${val?.note && 'border-b-2 border-border'}`}>
            {val?.floor}
          </Text>
        )}
        {val?.note && (
          <>
            <Text className="py-1">Note:</Text>
            <Text className="py-1 whitespace-pre-wrap wrap-break-word">
              {val.note}
            </Text>
          </>
        )}
      </View>
    </Card>
  );
}
