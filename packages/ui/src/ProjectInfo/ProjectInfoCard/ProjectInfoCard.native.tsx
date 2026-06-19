import { ProjectInfoCardProps } from './types';
import { Card } from '../../Card';
import { Button } from '../../button';
import { formatCurrency } from '@repo/app';
import { View, Text, Linking, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { ProjectInfoDialog } from '../ProjectInfoDialog';

export function ProjectInfoCard({ id, val }: ProjectInfoCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  const projectInfoCard = (
    <Card key={id} className="flex-row items-center">
      <View className="flex-1">
        <Text className="text-lg font-semibold text-primary">{id}</Text>
        {val.phone && <Text className="text-primary">{val.phone}</Text>}
        {val.location && <Text className="text-primary">{val.location}</Text>}
        {val.servicing && (
          <Text className="text-primary">
            Servicing: {formatCurrency(val.servicing)}
          </Text>
        )}
      </View>
      {val.phone && (
        <Button
          icon={'call'}
          variant="transparent"
          iconSize={28}
          className="!px-0"
          onPress={() => {
            Linking.openURL(`tel:${val.phone}`);
          }}
        />
      )}
    </Card>
  );

  return (
    <>
      <TouchableOpacity
        onLongPress={() => {
          setEditOpen(true);
        }}
        activeOpacity={0.7}
        delayLongPress={600}
      >
        {projectInfoCard}
      </TouchableOpacity>

      <ProjectInfoDialog
        id={id}
        val={val}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
