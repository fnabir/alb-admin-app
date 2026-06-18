import DeletePaymentInfoDialog from '../PaymentInfoDialog/DeletePaymentInfoDialog';
import { PaymentInfoRowProps } from './types';

export function PaymentInfoRow({
  type,
  id,
  value,
  isAdmin = false,
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
      {isAdmin && (
        <DeletePaymentInfoDialog
          type={type}
          id={id}
          value={value!.toString()}
        />
      )}
    </div>
  );
}
