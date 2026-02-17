'use client';

import { useEffect, useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@repo/app';
import { LoadingLink } from '@/components/LoadingLink';
import { Button, toast, FormInput } from '@repo/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginForm, useLoading } from '@repo/app';
import { MdCheck, MdInfoOutline } from 'react-icons/md';
import TextLogo from '@/images/logo-text';

export default function LoginPage() {
  useEffect(() => {
    document.title = 'Login | ALB Admin';
  }, []);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [loginError, setLoginError] = useState<string>('');
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const { startLoading, stopLoading } = useLoading();
  const onSubmit = async (data: LoginForm) => {
    startLoading();

    try {
      const result = await signInWithEmailAndPassword(
        data.email,
        data.password,
      );

      if (result) {
        toast.success('Login successful');
        console.log('Login successful');
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      if (error) stopLoading();
    }
  };

  useEffect(() => {
    if (!error) return;
    setLoginSuccess(false);
    switch (error.code) {
      case 'auth/invalid-email':
        setLoginError('Invalid email address!');
        break;
      case 'auth/user-not-found':
        setLoginError('Email not registered with us!');
        break;
      case 'auth/wrong-password':
        setLoginError('Wrong password!');
        break;
      case 'auth/network-request-failed':
        setLoginError('Network connection issue!');
        break;
      case 'auth/user-disabled':
        setLoginError('User access disabled!');
        break;
      default:
        setLoginError('Invalid email/password!');
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
          <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back</h1>
          <div className="text-muted">Sign in to your account to continue</div>
        </div>

        {error && (
          <div className="flex space-x-2 w-full items-center mb-6 px-4 py-3 bg-red-900/20 border border-error rounded-xl text-error">
            <MdInfoOutline />
            <div className="text-sm">{loginError}</div>
          </div>
        )}

        {!error && loginSuccess && (
          <div className="flex space-x-2 w-full items-center mb-6 px-4 py-3 bg-green-900/20 border border-success rounded-xl text-success">
            <MdCheck />
            <div className="text-sm">Login successful. Redirecting...</div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput<LoginForm>
            name="email"
            control={control}
            label="Email"
            placeholder="user@asianliftbd.com"
            disabled={loading}
            required={true}
          />
          <FormInput<LoginForm>
            name="password"
            control={control}
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            disabled={loading}
          />

          <div className="flex items-center justify-end pb-4">
            <LoadingLink
              href="/forgot-password"
              className="text-sm text-accent hover:text-blue-700 
                       dark:hover:text-blue-300 transition-colors"
            >
              Forgot password?
            </LoadingLink>
          </div>

          <Button
            type="submit"
            label="Sign In"
            loadingLabel="Signing in..."
            className="w-full"
            variant="danger"
            loading={isSubmitting}
            disabled={!isValid || isSubmitting}
          />
        </form>

        <div className="text-center">
          <div className="text-muted text-sm pt-2">
            Don&apos;t have an account? Contact us
          </div>
        </div>
      </div>
    </div>
  );
}
