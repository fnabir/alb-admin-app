import { FaChevronRight } from 'react-icons/fa6';
import { useBreadcrumbs } from './BreadcrumbContext';
import { LoadingLink } from '@repo/ui';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface BreadcrumbProps {
  className?: string;
}

export default function Breadcrumb({ className }: BreadcrumbProps) {
  const { items } = useBreadcrumbs();

  return (
    <nav className={`flex items-center space-x-2 ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center">
            {/* Content */}
            {item.href && !isLast ? (
              <LoadingLink
                href={item.href}
                className="font-medium text-muted hover:text-primary transition-colors duration-150"
              >
                {item.label}
              </LoadingLink>
            ) : (
              <span
                className={`font-medium ${
                  isLast ? 'text-primary' : 'text-muted'
                }`}
              >
                {item.label}
              </span>
            )}

            {/* Separator */}
            {!isLast && (
              <FaChevronRight className="ml-2 -mb-0.5 text-muted size-3" />
            )}
          </div>
        );
      })}
    </nav>
  );
}
