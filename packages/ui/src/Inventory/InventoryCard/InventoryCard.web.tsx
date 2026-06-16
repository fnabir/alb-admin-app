import { Button } from '../../button';
import { Card } from '../../Card';
import { InventoryDialog } from '../InventoryDialog';
import { DeleteInventoryDialog } from '../InventoryDialog/DeleteInventoryDialog';
import { InventoryCardProps } from './types';
import { MdEdit } from 'react-icons/md';

export function InventoryCard({ item, count }: InventoryCardProps) {
  return (
    <Card
      key={item}
      className="flex items-center justify-between hover:border-accent h-fit font-medium"
    >
      <div className="flex space-x-2">
        <InventoryDialog item={item} count={count}>
          <Button icon={MdEdit} />
        </InventoryDialog>
        <DeleteInventoryDialog item={item} count={count} />
      </div>

      <span>{item}</span>
      <span>{count}</span>
    </Card>
  );
}
