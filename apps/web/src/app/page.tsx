'use client';

import { Card, VersionCard } from '@repo/ui';
import { BalanceCard, IconCard } from '@repo/ui';
import packageJson from '@/../../../../package.json';
import PieChart from '@/components/PieChart';
import { FaBook, FaBuildingUser, FaTag, FaWrench } from 'react-icons/fa6';
import { getDatabaseReference } from '@repo/app';
import { useList, useListKeys } from 'react-firebase-hooks/database';
import { useEffect, useMemo } from 'react';
import { useBreadcrumbs } from '@/components/BreadcrumbContext';
import { LoadingLink } from '@/components/LoadingLink';
import { MdInventory, MdNearbyError } from 'react-icons/md';

const balanceOrder = ['project', 'staff', 'conveyance', 'ZZZ'] as const;

const iconCardData = [
  {
    href: '/project-info',
    icon: FaBuildingUser,
    title: 'Project Info',
    details: 'Location, Contact',
  },
  {
    href: '/payment-info',
    icon: FaTag,
    title: 'Payment Info',
    details: 'Project',
  },
  {
    href: '/callback',
    icon: FaWrench,
    title: 'Callback',
    details: 'Details, Status',
  },
  {
    href: '/error-code',
    icon: MdNearbyError,
    title: 'Error Code',
    details: 'NICE 3000',
  },
  {
    href: '/inventory',
    icon: MdInventory,
    title: 'Inventory',
    details: 'Item Name, Count',
  },
  {
    href: '/ledger',
    icon: FaBook,
    title: 'Financial Ledger',
    details: 'Daily Cash Flow',
  },
];

export default function Home() {
  const { setItems } = useBreadcrumbs();

  useEffect(() => {
    document.title = 'Dashboard | ALB Admin';
  }, []);

  useEffect(() => {
    setItems([{ label: 'Home' }]);
  }, [setItems]);

  const [totalBalanceData, totalBalanceLoading] = useList(
    getDatabaseReference('balance/total'),
  );

  const isAdmin = true;

  const filteredBalanceData = useMemo(() => {
    if (totalBalanceLoading || !totalBalanceData) return [];

    if (!isAdmin) {
      return totalBalanceData.filter((item) => item.key === 'project');
    }

    return [...totalBalanceData].sort((a, b) => {
      const keyA = (a.key ?? 'ZZZ') as (typeof balanceOrder)[number] | 'ZZZ';
      const keyB = (b.key ?? 'ZZZ') as (typeof balanceOrder)[number] | 'ZZZ';
      return balanceOrder.indexOf(keyA) - balanceOrder.indexOf(keyB);
    });
  }, [totalBalanceData, totalBalanceLoading, isAdmin]);

  const [offerDataKeys] = useListKeys(getDatabaseReference('forms/offer'));
  const [contactDataKeys] = useListKeys(getDatabaseReference('forms/contact'));
  const [quoteDataKeys] = useListKeys(getDatabaseReference('forms/quote'));

  const formdata = useMemo(() => {
    return [
      {
        name: 'Contact',
        value: contactDataKeys?.length ?? 0,
        color: '#bae6fd',
        colorClass: 'bg-[#bae6fd]',
      },
      {
        name: 'Quotation',
        value: quoteDataKeys?.length ?? 0,
        color: '#0ea5e9',
        colorClass: 'bg-[#0ea5e9]',
      },
      {
        name: 'Offer',
        value: offerDataKeys?.length ?? 0,
        color: '#0369a1',
        colorClass: 'bg-[#0369a1]',
      },
    ];
  }, [offerDataKeys, contactDataKeys, quoteDataKeys]);

  return (
    <div className="size-full flex flex-col lg:flex-row px-4 gap-3 lg:gap-4 overflow-y-auto">
      <div className="basis-3/4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-3">
          {filteredBalanceData?.map((card, index) => (
            <LoadingLink href={card?.key ?? '#'} key={index} className="w-full">
              <BalanceCard
                title={card?.key ?? ''}
                balance={card?.val().value}
                date={card?.val().date}
              />
            </LoadingLink>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {iconCardData.map((card, index) => (
            <LoadingLink
              href={card?.href ?? '#'}
              key={index}
              className="w-full"
            >
              <IconCard
                icon={card.icon}
                title={card.title}
                details={card.details}
              />
            </LoadingLink>
          ))}
        </div>
      </div>
      <div className="basis-1/4 flex flex-col space-y-4">
        <LoadingLink
          href={'changelog'}
          className="rounded-xl border border-border hover:border-accent"
        >
          <VersionCard version={packageJson.version} isAdmin={isAdmin} />
        </LoadingLink>

        <LoadingLink href={'forms'}>
          <Card className="flex flex-col items-center rounded-xl hover:border-accent">
            <div className="text-xl font-semibold mb-2">Forms</div>
            <div className="flex space-x-6 w-full">
              <div className="flex flex-col w-full items-center justify-center divide-y-2 divide-border">
                {formdata.map((item) => {
                  return (
                    <div
                      key={item.name}
                      className="flex items-center w-full justify-between space-x-2 py-1"
                    >
                      <div
                        className={`h-4 w-5 rounded-sm ${item.colorClass}`}
                      />
                      <div className="w-full">{item.name}</div>
                      <div className="text-lg">{item.value}</div>
                    </div>
                  );
                })}
              </div>
              <PieChart data={formdata} size={125} strokeWidth={10} />
            </div>
          </Card>
        </LoadingLink>
      </div>
    </div>
  );
}
