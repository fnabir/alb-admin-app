import { ChangePasswordForm, changePasswordSchema } from '@repo/app';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@repo/ui';
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  User,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

export default function ChangePasswordDialog({ user }: { user?: User | null }) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid, isDirty },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ChangePasswordForm) => {
    setLoading(true);

    if (!user) {
      toast.error('Error', 'No user found.');
      setOpen(false);
      setLoading(false);
      return;
    }

    const credential = EmailAuthProvider.credential(
      user.email as string,
      data.currentPassword,
    );

    try {
      await reauthenticateWithCredential(user, credential);

      if (data.currentPassword === data.newPassword) {
        toast.info('No Change', 'New password is same as current password.');
      } else {
        await updatePassword(user, data.newPassword);
        toast.success('Updated', 'Password updated successfully.');
      }
      setOpen(false);
      reset();
    } catch (error) {
      const e = error as FirebaseError;
      toast.error(
        'Error',
        e.code === 'auth/wrong-password'
          ? 'Wrong current password.'
          : e?.message || 'An error occurred.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        reset();
      }}
    >
      <DialogTrigger asChild>
        <Button
          label="Change Password"
          disabled={user ? false : true}
          className="w-full max-w-sm"
        />
      </DialogTrigger>
      <DialogContent className={'border-accent'}>
        <DialogHeader>
          <DialogTitle>Update Password</DialogTitle>
          <DialogDescription>
            Please confirm your current password before new password.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-3"
        >
          <FormInput<ChangePasswordForm>
            name="currentPassword"
            control={control}
            label="Current Password"
            placeholder="••••••••"
            secureTextEntry
          />
          <FormInput<ChangePasswordForm>
            name="newPassword"
            control={control}
            label="New Password"
            placeholder="••••••••"
            secureTextEntry
          />
          <FormInput<ChangePasswordForm>
            name="confirmNewPassword"
            control={control}
            label="Confirm New Password"
            placeholder="••••••••"
            secureTextEntry
          />

          <div className="flex space-x-2 pt-4 lg:pt-6 justify-center">
            <DialogClose asChild>
              <Button label={'Close'} variant="danger" className="w-full" />
            </DialogClose>
            <Button
              type="submit"
              variant="accent"
              label={'Update Password'}
              loadingLabel={'Updating...'}
              className="w-full"
              loading={isSubmitting}
              disabled={!isValid || !isDirty || isSubmitting}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
