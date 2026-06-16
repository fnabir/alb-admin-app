import { InventoryCardProps } from './types';
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
import { Button } from '../../button';
import { Dialog } from '../../dialog';
import { toast } from '../../toast';
import { InventoryDialog } from '../InventoryDialog';
import { deleteInventoryItem } from '@repo/app';

const SWIPE_THRESHOLD = 80;

export function InventoryCard({ item, count }: InventoryCardProps) {
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

  const inventoryCard = (
    <Card className="w-full flex-row items-center justify-between">
      <Text className="text-primary text-lg font-semibold">{item}</Text>
      <Text className="text-primary text-lg font-semibold">{count}</Text>
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
            {inventoryCard}
          </TouchableOpacity>
        </Animated.View>
      </View>

      <InventoryDialog
        item={item}
        count={count}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <Dialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Inventory Item?"
      >
        <Text className="text-primary mb-4">
          Are you sure you want to delete this inventory item?
        </Text>
        {inventoryCard}
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
                await deleteInventoryItem(item);
                toast.success('Deleted', 'Deleted the inventory item.');
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
