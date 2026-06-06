import { isEventDetailCameraFabVisible } from '@/src/features/event-detail/data/eventDetailDerived';
import { FloatingCameraFab } from '@/src/ui';
import { memo, useMemo } from 'react';

type Props = {
  eventDateIso?: string | null;
  onPress: () => void;
};

/** FAB de cámara: solo visible mientras el evento está en vivo. */
export const EventDetailCameraFabGate = memo(function EventDetailCameraFabGate({
  eventDateIso,
  onPress,
}: Props) {
  const visible = useMemo(
    () => isEventDetailCameraFabVisible(eventDateIso, new Date()),
    [eventDateIso],
  );

  if (!visible) {
    return null;
  }

  return <FloatingCameraFab onPress={onPress} respectBottomSafeArea={false} />;
});
