import {
  Text,
  View,
  Animated,
  PanResponder,
  TouchableOpacity,
} from 'react-native';
import { useRef, useState } from 'react';
import { Card } from '../Card';
import { Dialog } from '../dialog';
import { deleteTransaction, formatCurrency } from '@repo/app';
import { TransactionRowProps } from './types';
import { Button } from '../button';
import { Ionicons } from '@expo/vector-icons';
import { toast } from '../toast';

const SWIPE_THRESHOLD = 80;

export function TransactionRow({
  data,
  id,
  type,
}: TransactionRowProps & {
  id: string;
  type: 'staff' | 'conveyance';
}) {
  const val = data?.val();
  const bgColor: string = val.amount <= 0 ? 'bg-green-800' : 'bg-red-800';

  const [detailOpen, setDetailOpen] = useState(false);
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

  const transactionCard = (
    <Card
      className={`flex-row items-center justify-between !py-1 !px-3 ${bgColor}`}
    >
      <View>
        <Text className="text-lg text-white capitalize font-semibold">
          {val.title}
        </Text>
        {val.details && (
          <Text className="text-white capitalize pb-1">{val.details}</Text>
        )}
        {val.date && <Text className="text-white">{val.date}</Text>}
      </View>
      <Text className="text-xl text-white font-semibold">
        {formatCurrency(val.amount)}
      </Text>
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
            onLongPress={() => setDetailOpen(true)}
            activeOpacity={0.7}
            delayLongPress={600}
          >
            {transactionCard}
          </TouchableOpacity>
        </Animated.View>
      </View>

      <Dialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title="Edit Transaction"
      >
        <Text className="text-primary mb-2 capitalize">{val.title}</Text>
        {val.details && (
          <Text
            style={{
              color: '#ccc',
              marginBottom: 4,
              textTransform: 'capitalize',
            }}
          >
            {val.details}
          </Text>
        )}
        {val.date && (
          <Text style={{ color: '#aaa', marginBottom: 12 }}>{val.date}</Text>
        )}
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '600' }}>
          {formatCurrency(val.amount)}
        </Text>
      </Dialog>

      <Dialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Transaction?"
      >
        <Text className="text-primary mb-4">
          Are you sure you want to delete this transaction?
        </Text>
        {transactionCard}
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
                await deleteTransaction(type, id, data?.key!);
                toast.success('Deleted', 'Deleted the transaction.');
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
