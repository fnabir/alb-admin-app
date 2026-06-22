import { Card } from '../Card';
import { format } from 'date-fns';
import { changelog } from '@repo/app';
import { VersionCardProps } from './types';

export function VersionCard({ version, isAdmin }: VersionCardProps) {
  const log = changelog[version] ?? null;
  const date = log?.date;

  const filteredDetails =
    log?.details.filter((detail) => {
      return detail.startsWith('[ADMIN]') ? isAdmin : true;
    }) ?? [];

  function renderDetail(detail: string, index: number) {
    const cleanDetail = detail.replace('[ADMIN]', '').trim();

    const tagMatch = cleanDetail.match(/^\[(.*?)\]/);
    const tag = tagMatch ? tagMatch[1] : null;

    const message = tagMatch
      ? cleanDetail.replace(tagMatch[0], '').trim()
      : cleanDetail;

    return (
      <div
        key={index}
        className="w-full flex flex-row text-sm lg:text-[15px] py-0.5 space-x-2"
      >
        {tag && (
          <div
            className={`font-semibold ${
              tag === 'FEATURE'
                ? 'text-green-500'
                : tag === 'UPDATE'
                  ? 'text-sky-500'
                  : tag === 'FIX'
                    ? 'text-red-500'
                    : 'text-gray-500'
            }`}
          >
            [{tag}]
          </div>
        )}

        <div className="text-primary">{message}</div>
      </div>
    );
  }

  return (
    <Card className="flex flex-col items-center">
      <div className="text-sm lg:text-base font-semibold">ALB ADMIN APP</div>
      <div className="text-2xl lg:text-3xl font-mono text-accent">
        {version}
      </div>
      {date && (
        <div className="text-muted text-center text-sm lg:text-base">
          {format(new Date(date), 'dd MMMM yyyy')}
        </div>
      )}
      <div className="w-full h-[1px] bg-muted my-3" />
      {filteredDetails.length > 0 ? (
        filteredDetails.map((detail, index) => renderDetail(detail, index))
      ) : (
        <div className="py-1">No changelog available for this version.</div>
      )}
    </Card>
  );
}
