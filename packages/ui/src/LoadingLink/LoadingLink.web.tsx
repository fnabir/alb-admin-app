'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLoading } from '@repo/app';
import { ReactNode } from 'react';

type LoadingLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  prefetch?: boolean;
};

export function LoadingLink({
  href,
  children,
  className,
  prefetch,
}: LoadingLinkProps) {
  const router = useRouter();
  const { startLoading } = useLoading();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    startLoading();
    router.push(href);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={className}
      prefetch={prefetch}
    >
      {children}
    </Link>
  );
}
