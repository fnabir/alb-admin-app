'use client';

import { formatCurrency } from '@repo/app';
import { TotalBalanceProps } from './types';
import { MdUpdate } from 'react-icons/md';
import { Button } from '../button';
import { useState } from 'react';

export function TotalBalanceRow({
  title,
  value = 0,
  date,
  error,
  showUpdate,
  onClick,
  className = '',
}: TotalBalanceProps) {
  const [showUpdateState, setshowUpdateState] = useState(showUpdate);
  const handleOnClick = () => {
    if (onClick !== undefined) {
      onClick();
      setshowUpdateState(false);
    }
  };
  return (
    <div
      className={`shrink-0 flex items-center space-x-4 rounded-xl bg-card border-2 border-accent px-2 md:px-3 lg:px-4 py-1 lg:py-2 mx-2 md:mx-3 lg:mx-4 min-h-0 transition-all duration-200 ${className}`}
    >
      {error ? (
        <span className="flex-1 text-2xl">{error}</span>
      ) : (
        <>
          <div className="flex-1 flex flex-col">
            <span className="text-xl font-semibold">
              {title ?? 'Total Balance'}
            </span>
            {date && <span className="text-sm">Last updated on {date}</span>}
          </div>

          <span className="text-2xl font-semibold">
            {formatCurrency(value)}
          </span>
          {showUpdate && showUpdateState && (
            <Button
              icon={MdUpdate}
              variant="transparent"
              onPress={handleOnClick}
            />
          )}
        </>
      )}
    </div>
  );
}
