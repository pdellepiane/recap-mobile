import type { HomeCarouselScheduleKind } from '../utils/eventDisplay';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  scheduleKind: HomeCarouselScheduleKind | null;
};

/** Badge “en vivo” / “programado” sobre la tarjeta del carrusel de home. */
export function HomeEventCarouselScheduleBadge({ scheduleKind }: Props) {
  if (scheduleKind === 'live') {
    return (
      <View style={styles.liveRow}>
        <View style={styles.liveIconHalo}>
          <View style={styles.liveIconDot} />
        </View>
        <Text style={styles.liveText}>Evento en vivo</Text>
      </View>
    );
  }
  if (scheduleKind === 'scheduled') {
    return (
      <View style={styles.scheduledWrap}>
        <View style={styles.scheduledRow}>
          <View style={styles.scheduledIcon}>
            <Ionicons name="time" size={12} color={colors.neutral.onLime} />
          </View>
          <Text style={styles.scheduledText}>Evento programado</Text>
        </View>
        <View style={styles.scheduledUnderline} />
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveIconHalo: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.events.homeCardLiveHalo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveIconDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.events.homeCardLive,
  },
  liveText: {
    color: colors.events.homeCardLive,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: fontFamilies.signikaRegular,
    lineHeight: 20,
  },
  scheduledWrap: {
    alignSelf: 'flex-start',
  },
  scheduledRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scheduledIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduledText: {
    fontFamily: fontFamilies.signikaRegular,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.states.warning,
  },
  scheduledUnderline: {
    marginTop: 6,
    height: 1,
    width: '100%',
    backgroundColor: colors.countdown.cellBorder,
  },
});
