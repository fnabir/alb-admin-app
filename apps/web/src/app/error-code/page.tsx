'use client';

import { useBreadcrumbs } from '@/components/BreadcrumbContext';
import { useErrorCode } from '@repo/app';
import { Badge, Button, Card, EmptyUI, Input } from '@repo/ui';
import { useEffect, useState } from 'react';

export default function ErrorCode() {
  const { setItems } = useBreadcrumbs();

  useEffect(() => {
    setItems([{ label: 'Home', href: '/' }, { label: 'Error Code' }]);
  }, [setItems]);

  const [code, setCode] = useState('');
  const [errorCode, setErrorCode] = useState('');

  const info = useErrorCode(errorCode);

  return (
    <div className="w-full h-full flex flex-col space-y-2">
      <div className="flex flex-wrap items-center space-x-2 px-2 md:px-3 lg:px-4">
        <Input
          value={code}
          onChangeText={setCode}
          startAdornment="E"
          className="max-w-36"
        />
        <Button
          label="Search"
          onPress={() => setErrorCode(code)}
          disabled={!code || code == errorCode}
        />
      </div>
      {code &&
        code == errorCode &&
        (info ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 px-2 md:px-3 lg:px-4 gap-2 lg:gap-3 overflow-y-auto">
            <Card className="text-center space-y-2">
              <Badge
                label={`Error Code: E${code.length == 1 ? `0${code}` : code}`}
                className="mx-auto"
              />
              <p>{info?.description}</p>
            </Card>

            <Card className="text-center space-y-2">
              <Badge
                label={`Fault Code: ${info.level.code}`}
                className="mx-auto"
              />
              <p>{info?.level.description}</p>
            </Card>

            <Card className="space-y-2">
              <Badge label={`Cause`} className="mx-auto" />
              <CauseList items={info?.cause} />
            </Card>

            <Card className="space-y-2">
              <Badge label={`Solution`} className="mx-auto" />
              <SolutionList items={info?.solution} />
            </Card>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <EmptyUI text={`E${code} not found.`} />
          </div>
        ))}
    </div>
  );
}

function CauseList({ items }: { items: string[] }) {
  return (
    <ul className="pl-4 list-disc">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

type SolutionItem = string | [string, (string | SolutionItem)[]];

function SolutionList({ items }: { items: SolutionItem[] }) {
  return (
    <ol className="text-[15px] list-decimal pl-4 space-y-2">
      {items.map((item, i) => (
        <li key={i}>{renderItem(item)}</li>
      ))}
    </ol>
  );
}

function renderItem(item: SolutionItem): React.ReactNode {
  if (typeof item === 'string') {
    return item;
  }

  const [main, subs] = item;

  return (
    <>
      {main}

      {Array.isArray(subs) && subs.length > 0 && (
        <ul className="pl-6 list-disc py-0.5">
          {subs.map((sub, i) => (
            <li key={i}>{renderItem(sub)}</li>
          ))}
        </ul>
      )}
    </>
  );
}
