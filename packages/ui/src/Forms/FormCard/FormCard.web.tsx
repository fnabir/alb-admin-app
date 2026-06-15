import { Card } from '../../Card';
import { FormCardProps } from './types';
import { format, parseISO } from 'date-fns';

export function FormCard({
  id,
  val,
  children,
  type,
}: FormCardProps & { children?: React.ReactNode }) {
  return (
    <Card className={`hover:border-accent text-primary`}>
      <div className="flex flex-wrap items-center gap-2 font-semibold text-background">
        <div className="px-2 py-0.25 bg-primary rounded-full">
          {format(parseISO(val.date), 'dd MMM yyyy hh:mmaaa')}
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
      <div className="pt-1 flex-auto grid grid-cols-[minmax(auto,120px)_1fr] gap-2">
        <strong className="py-1 border-b-2 border-border">Full Name:</strong>
        <div className="py-1 border-b-2 border-border">{val.name}</div>

        {type === 'contact' ? (
          <>
            {val?.email && (
              <>
                <strong className="py-1 border-b-2 border-border">
                  Email:
                </strong>
                <div className="py-1 border-b-2 border-border">{val.email}</div>
              </>
            )}
            {val?.phone && (
              <>
                <strong className="py-1 border-b-2 border-border">
                  Phone:
                </strong>
                <div className="py-1 border-b-2 border-border">{val.phone}</div>
              </>
            )}
            {val?.subject && (
              <>
                <strong className="py-1 border-b-2 border-border">
                  Subject:
                </strong>
                <div className="py-1 border-b-2 border-border">
                  {val.subject}
                </div>
              </>
            )}
            {val?.message && (
              <>
                <strong
                  className={`py-1 ${val?.note && 'border-b-2 border-border'}`}
                >
                  Message:
                </strong>
                <pre
                  className={`py-1 whitespace-pre-wrap wrap-break-word ${val?.note && 'border-b-2 border-border'}`}
                >
                  {val.message}
                </pre>
              </>
            )}
          </>
        ) : (
          <>
            {val?.contact && (
              <>
                <strong className="py-1 border-b-2 border-border">
                  Contact:
                </strong>
                <div className="py-1 border-b-2 border-border">
                  {val.contact}
                </div>
              </>
            )}

            {val?.address && (
              <>
                <strong className="py-1 border-b-2 border-border">
                  Address:
                </strong>
                <div className="py-1 border-b-2 border-border">
                  {val.address}
                </div>
              </>
            )}
            <strong
              className={`py-1 ${
                (val?.person || val?.floor) && 'border-b-2 border-border'
              }`}
            >
              Product:
            </strong>
            <div
              className={`py-1 ${
                (val?.person || val?.floor) && 'border-b-2 border-border'
              }`}
            >{`${val?.product} ${val?.unit && `(${val?.unit})`} - ${val?.work}`}</div>

            {val.person && (
              <strong
                className={`py-1 ${val?.floor && 'border-b-2 border-border'}`}
              >
                Person/Load:
              </strong>
            )}
            {val?.person && (
              <div
                className={`py-1 ${val?.floor && 'border-b-2 border-border'}`}
              >
                {val?.person}
              </div>
            )}

            {val.floor && (
              <strong
                className={`py-1 ${val?.note && 'border-b-2 border-border '}`}
              >
                Floor/Stop:
              </strong>
            )}
            {val.floor && (
              <div
                className={`py-1 ${val?.note && 'border-b-2 border-border'}`}
              >
                {val?.floor}
              </div>
            )}
          </>
        )}
        {val?.note && (
          <>
            <strong className="py-1">Note:</strong>
            <pre className="py-1 whitespace-pre-wrap wrap-break-word">
              {val.note}
            </pre>
          </>
        )}
      </div>
    </Card>
  );
}
