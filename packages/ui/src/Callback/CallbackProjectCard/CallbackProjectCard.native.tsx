import { Button } from '../../button';
import { Dialog } from '../../dialog';
import { toast } from '../../toast';
import { CallbackProjectCardProps } from './types';
import { deleteCallback } from '@repo/app';
import {
  Text,
  View,
  Animated,
  PanResponder,
  TouchableOpacity,
} from 'react-native';
import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../Card';
import { CallbackDialog } from '../CallbackDialog';

const SWIPE_THRESHOLD = 80;

export function CallbackProjectCard({
  project,
  val,
  id,
}: CallbackProjectCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const translateX = useRef(new Animated.Value(0)).current;

  const resetPosition = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 10 && Math.abs(gs.dy) < 20,
      onPanResponderMove: (_, gs) => {
        translateX.setValue(gs.dx);
      },
      onPanResponderRelease: (_, gs) => {
        if (Math.abs(gs.dx) > SWIPE_THRESHOLD) {
          setDeleteOpen(true);
        }
        resetPosition();
      },
      onPanResponderTerminate: () => {
        resetPosition();
      },
      onPanResponderTerminationRequest: () => true,
    }),
  ).current;

  const callbackCard = (
    <Card className={`flex space-x-2 hover:border-accent text-primary`}>
      <View className="flex-1">
        <Text>{val.date}</Text>
        <Text className="flex-1 font-semibold pt-1">{val.details}</Text>
        <Text className="text-sm opacity-80">{val.name}</Text>
      </View>

      {val.status && (
        <View className="space-y-2">
          <Text className="text-sm text-background bg-primary rounded-lg px-2 py-0.5 text-center">
            {val.status}
          </Text>
        </View>
      )}
    </Card>
  );

  return (
    <>
      <View className="relative">
        <Animated.View
          className="absolute inset-0 rounded-xl flex-row items-center justify-between px-4 bg-red-600"
          style={{
            opacity: translateX.interpolate({
              inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
              outputRange: [1, 0, 1],
              extrapolate: 'clamp',
            }),
          }}
        >
          <Ionicons name="trash-outline" size={24} color="#fff" />
          <Ionicons name="trash-outline" size={24} color="#fff" />
        </Animated.View>

        <Animated.View
          style={{ transform: [{ translateX }] }}
          {...panResponder.panHandlers}
        >
          <TouchableOpacity
            onLongPress={() => {
              setEditOpen(true);
            }}
            activeOpacity={0.7}
            delayLongPress={600}
          >
            {callbackCard}
          </TouchableOpacity>
        </Animated.View>
      </View>

      <CallbackDialog
        project={project}
        val={val}
        id={id}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <Dialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Callback?"
      >
        <Text className="text-primary mb-4">
          Are you sure you want to delete this callback?
        </Text>
        {callbackCard}
        <View className="flex-row gap-2 justify-end mt-4">
          <Button
            label="Cancel"
            variant="secondary"
            onPress={() => setDeleteOpen(false)}
          />
          <Button
            label="Delete"
            variant="danger"
            onPress={async () => {
              setDeleteOpen(false);
              try {
                await deleteCallback(project, id);
                toast.success('Deleted', 'Deleted the callback.');
              } catch (error: any) {
                toast.error('Failed', error.message || null);
              }
            }}
          />
        </View>
      </Dialog>
    </>
  );
}
