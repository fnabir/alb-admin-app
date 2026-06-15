import { CallbackDialog } from '../CallbackDialog';
import { CallbackProjectCardProps } from './types';
import { Button, Card } from '../..';
import { MdEdit } from 'react-icons/md';
import DeleteCallbackDialog from './DeleteCallbackDialog';

export function CallbackProjectCard({
  project,
  val,
  id,
}: CallbackProjectCardProps) {
  return (
    <Card className={`flex space-x-2 hover:border-accent text-primary`}>
      <div className="flex-1">
        <div>{val.date}</div>
        <div className="flex-1 font-semibold pt-1">{val.details}</div>
        <div className="text-sm opacity-80">{val.name}</div>
      </div>

      <div className="space-y-2">
        {val.status && (
          <div className="text-sm text-background bg-primary rounded-lg px-2 py-0.5 text-center">
            {val.status}
          </div>
        )}
        <div className="flex space-x-2">
          <CallbackDialog project={project} val={val} id={id}>
            <Button icon={MdEdit} />
          </CallbackDialog>
          <DeleteCallbackDialog project={project} val={val} id={id} />
        </div>
      </div>
    </Card>
  );
}
