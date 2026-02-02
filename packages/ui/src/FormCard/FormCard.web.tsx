import { Card } from '../Card';
import { FormCardProps } from './types';
import { format, parseISO } from 'date-fns';

export function FormCard({ data, children, type }: FormCardProps) {
  const val = data.val();

  return (
    <Card className={`hover:border-accent text-primary`}>
      <div className="flex items-center space-x-2 font-semibold text-background">
        <div className="px-2 py-0.25 bg-primary rounded-full">
          {format(parseISO(val.date), 'dd MMM yyyy')}
        </div>
        <div className="px-2 py-0.25 bg-primary rounded-full capitalize">
          <span>{type}</span>
        </div>
        {val.status && (
          <div className="px-2 py-0.25 bg-primary rounded-full">
            {val.status}
          </div>
        )}
        <div className="pl-2 flex-1 flex space-x-2 justify-end">{children}</div>
      </div>
      <div className="pt-1 flex-auto grid grid-cols-[minmax(auto,30%)_1fr] md:grid-cols-[minmax(auto,25%)_1fr]">
        <strong className="py-1 border-b-2 border-border">Full Name:</strong>
        <div className="py-1 border-b-2 border-border">{val.name}</div>

        <strong className="py-1 border-b-2 border-border">Contact:</strong>
        <div className="py-1 border-b-2 border-border">{val.contact}</div>

        <strong className="py-1 border-b-2 border-border">Address:</strong>
        <div className="py-1 border-b-2 border-border">{val.address}</div>

        <strong
          className={`py-1 ${
            (val.person || val.floor) && 'border-b-2 border-border'
          }`}
        >
          Product:
        </strong>
        <div
          className={`py-1 ${
            (val.person || val.floor) && 'border-b-2 border-border'
          }`}
        >{`${val.product} ${val.unit && `(${val.unit})`} - ${val.work}`}</div>

        {val.person && (
          <strong className={`py-1 ${val.floor && 'border-b-2 border-border'}`}>
            Person/Load:
          </strong>
        )}
        {val.person && (
          <div className={`py-1 ${val.floor && 'border-b-2 border-border'}`}>
            {val.person}
          </div>
        )}

        {val.floor && (
          <strong className={`py-1 ${val.note && 'border-b-2 border-border '}`}>
            Floor/Stop:
          </strong>
        )}
        {val.floor && (
          <div className={`py-1 ${val.note && 'border-b-2 border-border'}`}>
            {val.floor}
          </div>
        )}

        {val.note && <strong className="py-1">Note:</strong>}
        {val.note && <pre className="py-1">{val.note}</pre>}
      </div>
    </Card>
  );
}
