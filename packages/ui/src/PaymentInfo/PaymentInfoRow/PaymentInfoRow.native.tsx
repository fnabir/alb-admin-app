import { Text } from 'react-native';
import { Card } from '../../Card/Card.native';
import { PaymentInfoRowProps } from './types';

export function PaymentInfoRow({
  type,
  id,
  value,
  children,
}: PaymentInfoRowProps) {
  const originalId = id?.split('_')[0];

  return (
    <Card className="flex-wrap flex-row space-x-2 px-1 py-2 items-center">
      <Text className="flex-1 font-semibold text-primary">{`${
        type === 'account' || (type === 'cell' && originalId?.length === 8)
          ? '***'
          : ''
      }${originalId}`}</Text>
      {type !== 'cash' && <Text className="text-primary">{value}</Text>}
      {children}
    </Card>
  );
}
