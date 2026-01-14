import { deletePaymentInfo } from '@repo/app';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  toast,
} from '@repo/ui';
import { useState } from 'react';
import { MdDelete } from 'react-icons/md';

export default function DeletePaymentInfoDialog({
  type,
  id,
  value,
}: {
  type: string;
  id: string;
  value: string;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePaymentInfo(type, id);
      toast.success('Deleted the payment info.');
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
          ariaLabel="Delete Payment Info dialog button"
          variant="transparent"
        />
      </DialogTrigger>
      <DialogContent className={'border-error'}>
        <DialogHeader>
          <DialogTitle>Delete Payment Info</DialogTitle>
          <DialogDescription>
            Confirm before deleting. This cannot be undone once confirmed.
          </DialogDescription>
        </DialogHeader>
        {type == 'cash' ? (
          <div className="p-2 border rounded-xl my-4 text-center">{value}</div>
        ) : (
          <div className="flex space-x-2 p-2 border rounded-xl my-4">
            <span className="flex-1">{id}</span>
            <span>{value}</span>
          </div>
        )}
        <Button
          type="submit"
          variant="danger"
          label="Delete"
          loadingLabel="Deleting..."
          className="px-10"
          loading={isDeleting}
          disabled={isDeleting}
          onPress={handleDelete}
        />
      </DialogContent>
    </Dialog>
  );
}
