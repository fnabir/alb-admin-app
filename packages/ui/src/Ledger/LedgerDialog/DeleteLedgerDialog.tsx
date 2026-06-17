'use client';

import { deleteLedgerTransaction, fromISODate } from '@repo/app';
import { Button } from '../../button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../dialog';
import { toast } from '../../toast';
import { useState } from 'react';
import { MdDelete } from 'react-icons/md';

export function DeleteLedgerDialog({
  date,
  id,
  children,
}: {
  date: string;
  id: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const year = fromISODate('yyyy', date);
  const month = fromISODate('M', date);
  const day = fromISODate('d', date);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteLedgerTransaction(year, month, day, id);
      toast.success('Deleted the ledger transaction.');
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
          ariaLabel="Delete Ledger Transaction dialog button"
          className="size-6"
        />
      </DialogTrigger>
      <DialogContent className={'border-error'}>
        <DialogHeader>
          <DialogTitle>Delete Ledger Transaction</DialogTitle>
          <DialogDescription>
            Confirm before deleting. This cannot be undone once confirmed.
          </DialogDescription>
        </DialogHeader>
        {children}
        <div className="flex space-x-2 mt-4 w-full">
          <DialogClose asChild>
            <Button label="Cancel" variant="secondary" className="w-full" />
          </DialogClose>
          <Button
            type="submit"
            variant="danger"
            label="Delete"
            loadingLabel="Deleting..."
            className="w-full"
            loading={isDeleting}
            disabled={isDeleting}
            onPress={handleDelete}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
