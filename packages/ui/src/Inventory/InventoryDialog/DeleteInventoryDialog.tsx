'use client';

import { deleteInventoryItem } from '@repo/app';
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
import { MdDelete } from 'react-icons/md';

export function DeleteInventoryDialog({
  item,
  count,
}: {
  item: string;
  count: number;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteInventoryItem(item);
      setOpen(false);
      setIsDeleting(false);
      toast.success(`Deleted Item: ${item}.`);
    } catch (error: any) {
      toast.error(`Failed: ${error.message}`, 'Please try again.');
    }
    setIsDeleting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button icon={MdDelete} ariaLabel={`Delete ${item}`} />
      </DialogTrigger>
      <DialogContent className={'border-error'}>
        <DialogHeader>
          <DialogTitle>Delete {item}</DialogTitle>
          <DialogDescription>
            Confirm before deleting. This cannot be undone once confirmed.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between p-2 border rounded-xl font-medium">
          <span>{item}</span>
          <span>{count}</span>
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
