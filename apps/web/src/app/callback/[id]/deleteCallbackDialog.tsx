import { deleteCallback } from '@repo/app';
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
import { DataSnapshot } from 'firebase/database';

export default function DeleteCallbackDialog({
  project,
  data,
}: {
  project: string;
  data: DataSnapshot;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const val = data.val();
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCallback(project, data.key!);
      toast.success('Deleted', 'Deleted the callback.');
    } catch (error: any) {
      toast.error(`Failed', '${error.message}`);
    }
    setIsDeleting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          icon={MdDelete}
          ariaLabel="Delete Callback Info dialog button"
        />
      </DialogTrigger>
      <DialogContent className={'border-error'}>
        <DialogHeader>
          <DialogTitle>Delete Callback</DialogTitle>
          <DialogDescription>
            Confirm before deleting. This cannot be undone once confirmed.
          </DialogDescription>
        </DialogHeader>
        <div className="flex space-x-2 lg:space-x-4 p-2 border rounded-xl">
          <span>{val.date}</span>
          <span className="flex-1">{val.details}</span>
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
