import { Text, View, Animated, PanResponder } from 'react-native';
import { Card } from '../../Card/Card.native';
import { PaymentInfoRowProps } from './types';
import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Dialog } from '../../dialog';
import { Button } from '../../button';
import { toast } from '../../toast';
import { deletePaymentInfo } from '@repo/app';

const SWIPE_THRESHOLD = 80;

export function PaymentInfoRow({
  type,
  id,
  value,
  isAdmin = false,
}: PaymentInfoRowProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const originalId = id?.split('_')[0];

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

  const paymentInfoCard = (
    <Card className="flex-wrap flex-row space-x-2 px-1 py-2 items-center">
      <Text className="flex-1 font-semibold text-primary">{`${
        type === 'account' || (type === 'cell' && originalId?.length === 8)
          ? '***'
          : ''
      }${originalId}`}</Text>
      {type !== 'cash' && <Text className="text-primary">{value}</Text>}
    </Card>
  );

  return isAdmin ? (
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
          {paymentInfoCard}
        </Animated.View>
      </View>

      <Dialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Payment Info?"
      >
        <Text className="text-primary mb-4">
          Are you sure you want to delete this payment info?
        </Text>
        {paymentInfoCard}
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
              try {
                await deletePaymentInfo(type, id);
                setDeleteOpen(false);
                toast.success('Deleted the payment info.');
              } catch (error: any) {
                toast.error(`Failed: ${error.message}`);
              }
            }}
          />
        </View>
      </Dialog>
    </>
  ) : (
    paymentInfoCard
  );
}
