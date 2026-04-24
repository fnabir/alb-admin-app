'use client';

import { deleteTransaction, formatCurrency } from '@repo/app';
import { ProjectTransactionRowProps } from './types';
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
import { Button } from '../button';
import { Ionicons } from '@expo/vector-icons';
import { toast } from '../toast';

const SWIPE_THRESHOLD = 80;

export function ProjectTransactionRow({
  transactionData,
  id,
}: ProjectTransactionRowProps & {
  id: string;
}) {
  const val = transactionData?.val();

  const paidData = val?.data;
  const paidArray = Object.entries(paidData ?? {}).map(([key, value]) => ({
    key,
    ...(value as { details: string; amount: number }),
  }));
  const totalPaid: number = Object.values(paidData ?? {}).reduce(
    (sum: number, item: any) => sum + Number(item.amount || 0),
    0,
  );

  const amount = Number(val.amount);
  const afterPayment = totalPaid + amount;

  const bgColor: string =
    amount === 0
      ? 'bg-green-800'
      : amount < 0
        ? afterPayment === 0
          ? 'bg-green-800'
          : totalPaid === 0
            ? 'bg-zinc-800'
            : totalPaid > amount
              ? 'bg-yellow-800'
              : '!bg-blue-800'
        : totalPaid === 0
          ? 'bg-red-800'
          : amount === totalPaid
            ? 'bg-green-800'
            : totalPaid > amount
              ? 'bg-yellow-800'
              : '!bg-blue-800';

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

  const transactionCard = (
    <Card className={`!py-1 !px-3 ${bgColor}`}>
      <View className="flex-row items-center justify-between -mb-1.5">
        <View>
          <Text className="text-lg text-white capitalize font-semibold">
            {val.title}
          </Text>
          {val.details && (
            <Text className="text-white capitalize">{val.details}</Text>
          )}
          {val.date && <Text className="text-white">{val.date}</Text>}
        </View>
        <Text className="text-xl text-white font-semibold">
          {formatCurrency(val.amount)}
        </Text>
      </View>

      {paidArray && (
        <View className="w-full bg-black/80 rounded-md">
          {paidArray
            .sort((a, b) => b.key!.localeCompare(a.key!))
            .map((item) => {
              return (
                <View
                  className="flex-row space-x-2 lg:space-x-3 px-2 pt-1"
                  key={item.key}
                >
                  <Text className="text-white">
                    {item.details.substring(0, 8)}
                  </Text>
                  <Text className="flex-1 text-white">
                    {item.details.substring(8)}
                  </Text>
                  <Text className="text-white">
                    {formatCurrency(item.amount)}
                  </Text>
                </View>
              );
            })}
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
            onLongPress={() => setEditOpen(true)}
            activeOpacity={0.7}
            delayLongPress={600}
          >
            {transactionCard}
          </TouchableOpacity>
        </Animated.View>
      </View>

      <Dialog
        open={editOpen}
        onOpenChange={setEditOpen}
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
                await deleteTransaction('project', id, transactionData?.key!);
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
