import { Badge } from '../../badge';
import { Card } from '../../Card';
import { FormCardProps } from './types';
import { format, parseISO } from 'date-fns';
import { Button } from '../../button';
import { Dialog } from '../../dialog';
import { toast } from '../../toast';
import { deleteForm } from '@repo/app';
import {
  Text,
  View,
  Animated,
  PanResponder,
  TouchableOpacity,
} from 'react-native';
import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { WebsiteFormDialog } from '../WebsiteFormDialog';
import { OfferFormDialog } from '../OfferFormDialog';

const SWIPE_THRESHOLD = 80;

export function FormCard({ id, val, type }: FormCardProps) {
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

  const formCard = (
    <Card>
      <View className="flex-row flex-wrap items-center justify-center gap-2">
        <Badge
          textClassName="!lowercase"
          label={format(parseISO(val.date), 'dd MMM yyyy hh:mma')}
        />
        <Badge label={type} />
        {val.status && <Badge label={val.status} variant="success" />}
      </View>
      <View className="pt-1 flex-auto grid grid-cols-[minmax(auto,120px)_1fr]">
        <Text className="py-1 border-b-2 border-border text-primary">
          {`Full Name: ${val.name}`}
        </Text>

        {val?.contact && (
          <Text className="py-1 border-b-2 border-border text-primary">
            {`Contact: ${val.contact}`}
          </Text>
        )}

        {val?.email && (
          <Text className="py-1 border-b-2 border-border text-primary">
            {`Email: ${val.email}`}
          </Text>
        )}
        {val?.phone && (
          <Text className="py-1 border-b-2 border-border text-primary">
            {`Phone: ${val.phone}`}
          </Text>
        )}
        {val?.subject && (
          <Text className="py-1 border-b-2 border-border text-primary">
            {`Subject: ${val.subject}`}
          </Text>
        )}
        {val?.message && (
          <Text
            className={`py-1 text-primary ${val?.note && 'border-b-2 border-border'}`}
          >
            {`Message: ${val.message.trim()}`}
          </Text>
        )}

        {val?.address && (
          <Text className="py-1 border-b-2 border-border text-primary">
            {`Address: ${val.address}`}
          </Text>
        )}

        {val?.product && (
          <Text
            className={`py-1 text-primary ${
              (val?.person || val?.floor) && 'border-b-2 border-border'
            }`}
          >
            {`Product: ${`${val?.product} ${val?.unit && `(${val?.unit})`} - ${val?.work}`}`}
          </Text>
        )}

        {val.person && (
          <Text
            className={`py-1 text-primary ${val?.floor && 'border-b-2 border-border'}`}
          >
            {`Person/Load: ${val.person}`}
          </Text>
        )}

        {val.floor && (
          <Text
            className={`py-1 text-primary ${val?.note && 'border-b-2 border-border'}`}
          >
            {`Floor/Stop: ${val.floor}`}
          </Text>
        )}

        {val?.note && (
          <Text className="py-1 whitespace-pre-wrap wrap-break-word text-primary">
            {`Note: ${val.note.trim()}`}
          </Text>
        )}
      </View>
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
            {formCard}
          </TouchableOpacity>
        </Animated.View>
      </View>

      {type === 'offer' ? (
        <OfferFormDialog
          id={id}
          val={val}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      ) : (
        <WebsiteFormDialog
          type={type}
          val={val}
          id={id}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}

      <Dialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Form?"
      >
        <Text className="text-primary mb-4">
          Are you sure you want to delete this form?
        </Text>
        <View className="flex-row gap-1 p-2 border rounded-xl justify-center">
          <Text className="capitalize">{type}</Text>
          <Text>-</Text>
          <Text>{val.name}</Text>
        </View>
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
                await deleteForm(type, id);
                toast.success('Deleted', `Deleted the ${type}.`);
              } catch (error: any) {
                toast.error('Failed', error.message);
              }
            }}
          />
        </View>
      </Dialog>
    </>
  );
}
