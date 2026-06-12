import { PaymentInfoRowProps } from './types';

export function PaymentInfoRow({
  type,
  id,
  value,
  children,
}: PaymentInfoRowProps) {
  const originalId = id?.split('_')[0];

  return (
    <div className="flex space-x-2 p-1 items-center">
      <div className="flex-auto font-semibold">{`${
        type === 'account' || (type === 'cell' && originalId?.length === 8)
          ? '***'
          : ''
      }${originalId}`}</div>
      {type !== 'cash' && <div>{value}</div>}
      {children}
    </div>
  );
}
