import {
  type HomeEventCarouselCardVariant,
  useHomeEventCarouselCard,
} from '../hooks/useHomeEventCarouselCard';
import { HomeEventCarouselCardCover } from './HomeEventCarouselCardCover';
import { HomeEventCarouselGuestRow } from './HomeEventCarouselGuestRow';
import { HomeEventCarouselScheduleBadge } from './HomeEventCarouselScheduleBadge';
import type { Event } from '@/src/domain/entities';
import { colors } from '@/src/ui';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const CARD_W = 280;
const CARD_RADIUS = 28;

type Props = {
  event: Event;
  onPress: () => void;
  /** Stagger index for list entrance animation */
  index?: number;
  /** Guest “Planes” row uses “Por ti” + user initials; hosted rows use first host. */
  variant?: HomeEventCarouselCardVariant;
};

export function HomeEventCarouselCard({ event, onPress, index = 0, variant = 'hosted' }: Props) {
  const { day, month, guestLabel, scheduleKind, faceNames, coverInitials, coverLabel } =
    useHomeEventCarouselCard(event, variant);

  return (
    <Animated.View
      entering={FadeInDown.duration(420)
        .delay(Math.min(index, 8) * 52)
        .springify()
        .damping(18)
        .stiffness(180)}
      style={styles.cardOuter}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.pressable, pressed && styles.cardPressed]}
        accessibilityRole="button"
        accessibilityLabel={event.title}
      >
        <View style={styles.card}>
          <HomeEventCarouselCardCover
            coverImageUrl={event.coverImageUrl}
            day={day}
            month={month}
            coverInitials={coverInitials}
            coverLabel={coverLabel}
          />

          <View style={styles.body}>
            <HomeEventCarouselScheduleBadge scheduleKind={scheduleKind} />

            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {event.title}
            </Text>

            <HomeEventCarouselGuestRow faceNames={faceNames} guestLabel={guestLabel} />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    marginRight: 14,
  },
  pressable: {
    borderRadius: CARD_RADIUS,
  },
  card: {
    width: CARD_W,
    backgroundColor: colors.background.primary,
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: colors.background.elevated,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.94,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 8,
  },
  title: {
    color: colors.neutral.primary,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
});
