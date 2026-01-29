'use client';

import { useBreadcrumbs } from '@/components/BreadcrumbContext';
import { Loading } from '@/components/Loading';
import { useAuth } from '@/contexts/AuthContext';
import {
  auth,
  getDatabaseReference,
  updateUserInfo,
  UserForm,
  userSchema,
} from '@repo/app';
import { Button, EmptyUI, ErrorUI, Input, toast } from '@repo/ui';
import { useEffect } from 'react';
import { useObject } from 'react-firebase-hooks/database';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@repo/ui';
import { useUpdateProfile } from 'react-firebase-hooks/auth';
import ChangePasswordDialog from './changePasswordDialog';

export default function User() {
  const { setItems } = useBreadcrumbs();
  const { user } = useAuth();
  const [updateProfile] = useUpdateProfile(auth);
  const uid = user?.uid;

  useEffect(() => {
    document.title = 'User | ALB Admin';
  }, []);

  useEffect(() => {
    setItems([{ label: 'Home', href: '/' }, { label: 'User' }]);
  }, [setItems]);

  const [data, loading, error] = useObject(
    getDatabaseReference(`info/user/${uid}`),
  );
  const val = data?.val();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid, isDirty },
  } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    mode: 'onChange',
  });

  const onSubmit = async (formData: UserForm) => {
    if (!uid) {
      toast.error('User ID not found.', 'Please refresh the page.');
      return;
    }

    try {
      await updateUserInfo(uid, formData);
      toast.success('Updated', 'Updated the info successfully.');
    } catch (error) {
      toast.error('Error', `Failed to update: ${error}`);
    }
  };

  const handleReset = () => {
    reset({
      name: val?.name ?? '',
      phone: val?.phone ?? '',
    });
  };

  useEffect(() => {
    handleReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (!data) return;

    if (!val?.name) return;

    if (val?.name == user?.displayName) return;

    const updateUserDisplayName = async () => {
      try {
        await updateProfile({ displayName: val?.name });
        toast.success('Updated', 'Display Name auto-updated.');
      } catch (err) {
        toast.error(
          'Failed to update user display name.',
          'Please reload the page.',
        );
      }
    };

    updateUserDisplayName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, user]);

  return (
    <div className="size-full flex flex-col space-y-2">
      <div className="flex items-center space-x-2 px-2 md:px-3 lg:px-4"></div>
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loading isFullScreen={false} />
        </div>
      ) : error ? (
        <ErrorUI error={error} />
      ) : !data ? (
        <EmptyUI />
      ) : (
        <div className="flex-1 flex flex-col space-y-2 items-center overflow-y-auto px-2 md:px-3 lg:px-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            onReset={handleReset}
            className="w-full max-w-sm"
          >
            <FormInput<UserForm>
              name="name"
              control={control}
              label="Name"
              disabled={isSubmitting}
            />
            <FormInput<UserForm>
              name="phone"
              control={control}
              label="Phone Number"
              disabled={isSubmitting}
            />
            <Input label="Title" value={val.title} disabled />
            <Input
              label="Role"
              value={
                val.role?.charAt(0).toUpperCase() + val.role?.slice(1) || ''
              }
              disabled
            />
            <div className="flex space-x-2 pt-4 lg:pt-6 justify-center">
              <Button
                type="reset"
                label={'Reset'}
                variant="secondary"
                className="w-full"
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                variant="accent"
                label={'Update'}
                loadingLabel={'Updating...'}
                className="w-full"
                loading={isSubmitting}
                disabled={!isValid || !isDirty || isSubmitting}
              />
            </div>
          </form>
          <ChangePasswordDialog user={user} />
        </div>
      )}
    </div>
  );
}
