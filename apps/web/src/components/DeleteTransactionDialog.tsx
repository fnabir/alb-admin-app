import { deleteTransaction } from '@repo/app';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  toast,
  TransactionRow,
} from '@repo/ui';
import { useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { DataSnapshot } from 'firebase/database';

export default function DeleteTransactionDialog({
  type,
  id,
  data,
}: {
  type: 'project' | 'staff' | 'conveyance';
  id: string;
  data: DataSnapshot;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const paidData = data?.val().data;
  const dataKeys = paidData ? Object.keys(paidData) : [];

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteTransaction(type, id, data.key!, dataKeys);
      toast.success('Deleted the transaction.');
    } catch (error: any) {
      toast.error(`Failed: ${error.message}`);
    }
    setIsDeleting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          icon={MdDelete}
          ariaLabel="Delete Transaction dialog button"
          className="text-black bg-white"
        />
      </DialogTrigger>
      <DialogContent className={'border-error'}>
        <DialogHeader>
          <DialogTitle>Delete Transation</DialogTitle>
          <DialogDescription>
            Confirm before deleting. This cannot be undone once confirmed.
          </DialogDescription>
        </DialogHeader>
        <TransactionRow data={data} />
        <div className="flex space-x-2 mt-4 w-full">
          <DialogClose asChild>
            <Button label="Cancel" variant="secondary" className="flex-1" />
          </DialogClose>
          <Button
            type="submit"
            variant="danger"
            label="Delete"
            loadingLabel="Deleting..."
            className="flex-1"
            loading={isDeleting}
            disabled={isDeleting}
            onPress={handleDelete}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
