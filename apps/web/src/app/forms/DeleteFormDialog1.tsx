import { deleteForm } from '@repo/app';
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
} from '@repo/ui';
import { useState } from 'react';

export default function DeleteFormDialog({
  type,
  id,
  name,
  children,
}: {
  type: 'offer' | 'contact' | 'quote';
  id: string;
  name?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteForm(type, id);
      toast.success('Deleted', `Deleted the ${type}.`);
    } catch (error: any) {
      toast.error('Failed', error.message);
    }
    setIsDeleting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={'border-error'}>
        <DialogHeader>
          <DialogTitle className="capitalize">Delete {type}</DialogTitle>
          <DialogDescription>
            Confirm before deleting. This cannot be undone once confirmed.
          </DialogDescription>
        </DialogHeader>
        <div className="flex space-x-2 p-2 border rounded-xl justify-center">
          <span className="capitalize">{type}</span>
          <span>-</span>
          <span>{name}</span>
        </div>

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
