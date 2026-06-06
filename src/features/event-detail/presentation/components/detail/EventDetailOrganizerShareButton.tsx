import { isEventDetailOrganizerScheduledVisible } from '@/src/features/event-detail/data/eventDetailDerived';
import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { Button } from '@/src/ui';
import { memo, useMemo } from 'react';
import { StyleSheet } from 'react-native';

type Props = {
  eventDateIso?: string | null;
  isOrganizer: boolean;
  onPress: () => void;
};

/** Botón compartir del anfitrión en evento programado (día futuro). */
export const EventDetailOrganizerShareButton = memo(function EventDetailOrganizerShareButton({
  eventDateIso,
  isOrganizer,
  onPress,
}: Props) {
  const { t } = useTranslation();
  const visible = useMemo(
    () => isEventDetailOrganizerScheduledVisible(eventDateIso, isOrganizer, new Date()),
    [eventDateIso, isOrganizer],
  );

  if (!visible) {
    return null;
  }

  return (
    <Button
      title={t('eventDetail.shareEvent')}
      onPress={onPress}
      variant="brand"
      size="sm"
      accessibilityLabel={t('eventDetail.shareEvent')}
      rightIconSource={images.common.share}
      style={styles.shareBtn}
    />
  );
});

const styles = StyleSheet.create({
  shareBtn: {
    marginBottom: 24,
  },
});
