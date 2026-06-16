import { View, ScrollView, Text, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderBar } from '@/src/components/HeaderBar';
import { useState } from 'react';
import { useErrorCode } from '@repo/app';
import { Input, Button, Card, Badge, EmptyUI } from '@repo/ui';

function CauseList({ items }: { items: string[] }) {
  return (
    <View className="gap-1">
      {items.map((item, i) => (
        <View key={i} className="flex-row">
          <Text className="text-primary mr-2">•</Text>
          <Text className="text-primary flex-1">{item}</Text>
        </View>
      ))}
    </View>
  );
}

type SolutionItem = string | [string, (string | SolutionItem)[]];

function SolutionList({ items }: { items: SolutionItem[] }) {
  return (
    <View className="gap-2">
      {items.map((item, i) => (
        <View key={i} className="flex-row">
          <Text className="text-primary mr-2">{i + 1}.</Text>
          <View className="flex-1">{renderItem(item)}</View>
        </View>
      ))}
    </View>
  );
}

function renderItem(item: SolutionItem): React.ReactNode {
  if (typeof item === 'string') {
    return <Text className="text-primary">{item}</Text>;
  }

  const [main, subs] = item;

  return (
    <View className="gap-1">
      <Text className="text-primary">{main}</Text>
      {Array.isArray(subs) && subs.length > 0 && (
        <View className="gap-1 py-0.5">
          {subs.map((sub, i) => (
            <View key={i} className="flex-row">
              <Text className="text-primary mr-2">•</Text>
              <View className="flex-1">{renderItem(sub)}</View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default function ErrorCodeScreen() {
  const [code, setCode] = useState('');
  const [errorCode, setErrorCode] = useState('');

  const info = useErrorCode(errorCode);

  return (
    <SafeAreaView className="flex-1 bg-background gap-2">
      <HeaderBar title="Error Code" subtitle="NICE 3000" />
      <View className="w-full flex-row items-center gap-2 px-2">
        <Input
          value={code}
          onChangeText={setCode}
          startAdornment="E"
          className="flex-1"
          returnKeyType="search"
          onSubmitEditing={() => {
            Keyboard.dismiss();
            setErrorCode(code);
          }}
        />
        <Button
          icon="search"
          onPress={async () => {
            Keyboard.dismiss();
            setErrorCode(code);
          }}
          disabled={!code || code === errorCode}
          className="!px-2 !py-2"
        />
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        className="bg-background p-2"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {code && code === errorCode ? (
          info ? (
            <View className="gap-2">
              <Card className="text-center space-y-2">
                <Badge
                  label={`Error Code: E${code.length === 1 ? `0${code}` : code}`}
                  className="mx-auto"
                />
                <Text className="text-primary text-center text-lg">
                  {info.description}
                </Text>
              </Card>

              <Card className="text-center space-y-2">
                <Badge
                  label={`Fault Code: ${info.level.code}`}
                  className="mx-auto"
                />
                <Text className="text-primary text-center text-lg">
                  {info.level.description}
                </Text>
              </Card>

              <Card className="space-y-2">
                <Badge label={`Cause`} className="mx-auto" />
                <CauseList items={info?.cause} />
              </Card>

              <Card className="space-y-2">
                <Badge label={`Solution`} className="mx-auto" />
                <SolutionList items={info?.solution} />
              </Card>
            </View>
          ) : (
            <View className="flex-1 flex items-center justify-center">
              <EmptyUI text={`E${code} not found.`} />
            </View>
          )
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
