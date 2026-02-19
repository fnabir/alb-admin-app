'use client';

import { useEffect, useState } from 'react';
import TextLogo from '@/images/logo-text';
import { Button, FormInput, LoadingLink } from '@repo/ui';
import {
  auth,
  ForgetPasswordForm,
  forgetPasswordSchema,
  useLoading,
} from '@repo/app';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import { MdCheck, MdInfoOutline } from 'react-icons/md';

export default function ForgetPassword() {
  useEffect(() => {
    document.title = 'Forget Password | ALB Admin';
  }, []);

  const [sendError, setSendError] = useState('');
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);
  const [sendPasswordResetEmail, loading, error] =
    useSendPasswordResetEmail(auth);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<ForgetPasswordForm>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const { startLoading, stopLoading } = useLoading();
  const onSubmit = async (data: ForgetPasswordForm) => {
    startLoading();

    try {
      const result = await sendPasswordResetEmail(data.email);

      if (result) {
        setSendSuccess(true);
        console.log('Sent reset password link.');
      }
    } catch (err) {
      console.error('Send error:', err);
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    if (!error) return;
    setSendSuccess(false);
    switch (error.message) {
      case 'Firebase: Error (auth/user-not-found).':
        setSendError('Email not registered with us!');
        break;
      default:
        setSendError(`Error sending reset email: ${error.message}`);
        break;
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md p-8">
        <div className="w-2/3 mx-auto">
          <TextLogo />
        </div>

        <div className="text-center my-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Forget Password
          </h1>
          <div className="text-muted">
            Submit your email address to get the link to reset password
          </div>
        </div>

        {error && (
          <div className="flex space-x-2 w-full items-center mb-6 px-4 py-3 bg-red-900/20 border border-error rounded-xl text-error">
            <MdInfoOutline />
            <div className="text-sm">{sendError}</div>
          </div>
        )}

        {!error && sendSuccess && (
          <div className="flex space-x-2 w-full items-center mb-6 px-4 py-3 bg-green-900/20 border border-success rounded-xl text-success">
            <MdCheck />
            <div className="text-sm">Check your email to reset password.</div>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <FormInput<ForgetPasswordForm>
            name="email"
            control={control}
            label="Email"
            placeholder="user@asianliftbd.com"
            disabled={loading}
            required={true}
          />

          <Button
            type="submit"
            label="Send Password Reset Link"
            loadingLabel="Sending..."
            className="w-full"
            variant="danger"
            loading={isSubmitting}
            disabled={!isValid || isSubmitting}
          />

          <LoadingLink href="/login">
            <Button
              label="Go to Login Page"
              className="w-full"
              disabled={isSubmitting}
            />
          </LoadingLink>
        </form>
      </div>
    </div>
  );
}
