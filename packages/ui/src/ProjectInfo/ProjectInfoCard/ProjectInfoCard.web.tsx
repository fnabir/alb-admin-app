import { ProjectInfoCardProps } from './types';
import { Card } from '../../Card';
import { Button } from '../../button';
import { ProjectInfoDialog } from '../ProjectInfoDialog';
import { MdCall, MdEdit } from 'react-icons/md';
import Link from 'next/link';
import { formatCurrency } from '@repo/app';
import { Badge } from '../../badge';

export function ProjectInfoCard({ id, val }: ProjectInfoCardProps) {
  return (
    <Card className="flex h-full hover:border-accent" key={id}>
      <div className="flex-1">
        <div className="text-primary font-semibold text-[16px]">{id}</div>
        {val.location && <div className="text-primary">{val.location}</div>}
        {val.phone && (
          <div className="text-primary">{`${val.phone} ${
            val.contactName ? `(${val.contactName})` : ''
          }`}</div>
        )}
        {val.servicing && val.servicing > 0 ? (
          <div className="text-primary font-semibold">{`Servicing: ${formatCurrency(
            val.servicing,
          )}`}</div>
        ) : null}
        {val.cancelled ? (
          <Badge variant="error" className="w-fit" label="Cancelled" />
        ) : null}
      </div>

      <div className="flex flex-col items-center justify-center space-y-2">
        <ProjectInfoDialog id={id} val={val}>
          <Button icon={MdEdit} ariaLabel="Edit Button" variant="outline" />
        </ProjectInfoDialog>
        {val.phone && (
          <Link href={`tel:${val.phone}`}>
            <Button icon={MdCall} ariaLabel="Call Button" variant="outline" />
          </Link>
        )}
      </div>
    </Card>
  );
}
