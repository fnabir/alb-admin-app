import { MdBuild, MdDashboard, MdInventory } from 'react-icons/md';
import { LoadingLink } from './LoadingLink';
import { IconType } from 'react-icons';
import {
  FaBook,
  FaBuildingUser,
  FaBusSimple,
  FaGlobe,
  FaLinkedinIn,
  FaMoneyBillTransfer,
  FaSquareFacebook,
  FaUser,
  FaWpforms,
  FaWrench,
} from 'react-icons/fa6';
import TextLogo from '@/images/logo-text';

export type SidebarGroup = {
  label?: string;
  items: {
    href: string;
    icon: IconType;
    text: string;
  }[];
};

export const links: SidebarGroup[] = [
  {
    items: [{ href: '/', icon: MdDashboard, text: 'Dashboard' }],
  },
  {
    label: 'Balance',
    items: [
      { href: '/project', icon: MdBuild, text: 'Project' },
      { href: '/staff', icon: FaUser, text: 'Staff' },
      { href: '/conveyance', icon: FaBusSimple, text: 'Conveyance' },
    ],
  },
  {
    label: 'Projects',
    items: [
      { href: '/callback', icon: FaWrench, text: 'Callback' },
      { href: '/project-info', icon: FaBuildingUser, text: 'Info' },
      { href: '/payment-info', icon: FaMoneyBillTransfer, text: 'Payment' },
    ],
  },
  {
    items: [
      { href: '/ledger', icon: FaBook, text: 'Ledger' },
      { href: '/inventory', icon: MdInventory, text: 'Inventory' },
      { href: '/forms', icon: FaWpforms, text: 'Forms' },
      { href: '/error-code', icon: FaBook, text: 'Error Code' },
    ],
  },
  {
    label: 'Links',
    items: [
      {
        href: 'https://asianliftbd.com',
        icon: FaGlobe,
        text: 'Website',
      },
      {
        href: 'https://www.facebook.com/asianliftbangladesh',
        icon: FaSquareFacebook,
        text: 'Facebook',
      },
      {
        href: 'https://www.linkedin.com/company/asian-lift-bangladesh',
        icon: FaLinkedinIn,
        text: 'LinkedIn',
      },
    ],
  },
];

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col h-full p-2 lg:p-3 space-y-4">
      {/* App Icon / Logo */}
      <div className="w-5/6">
        <TextLogo />
      </div>

      {/* Links */}
      <div className="flex-1 space-y-4">
        {links.map((group, index) => (
          <div key={index} className="flex flex-col">
            {/* Group Label */}
            {group.label && (
              <div className="px-2 py-1 text-xs font-semibold text-muted uppercase">
                {group.label}
              </div>
            )}

            {/* Items */}
            {group.items.map(({ href, icon: Icon, text }) => {
              const isExternal = href.startsWith('http');
              const content = (
                <>
                  <Icon className="h-4 w-4" />
                  <span>{text}</span>
                </>
              );

              if (isExternal) {
                return (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-background text-primary"
                    onClick={onNavigate}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <button key={href} onClick={() => onNavigate?.()}>
                  <LoadingLink
                    href={href}
                    className="flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-background transition-colors duration-200 text-primary"
                  >
                    {content}
                  </LoadingLink>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </nav>
  );
}
