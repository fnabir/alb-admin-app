import { MdOutlineInfo } from 'react-icons/md';

export function ErrorUI({ error }: { error: Error }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-lg">
      <MdOutlineInfo className="size-16" />
      {error.message}
    </div>
  );
}
