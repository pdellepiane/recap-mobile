import { useHomeEventCarouselCard } from '../hooks/useHomeEventCarouselCard';
import { HomeEventVariant } from '../types';
import { HomeEventCarouselCardCover } from './HomeEventCarouselCardCover';
import { HomeEventCarouselGuestRow } from './HomeEventCarouselGuestRow';
import { HomeEventCarouselScheduleBadge } from './HomeEventCarouselScheduleBadge';
import type { Event } from '@/src/domain/entities';
import { colors, radii } from '@/src/ui';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const CARD_W = 280;

type Props = {
  event: Event;
  onPress: () => void;
  /** Stagger index for list entrance animation */
  index?: number;
  variant?: HomeEventVariant;
};

export function HomeEventCarouselCard({
  event,
  onPress,
  index = 0,
  variant = HomeEventVariant.Hosted,
}: Props) {
  const { day, month, guestLabel, type, faceNames, coverInitials, coverLabel } =
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
            <HomeEventCarouselScheduleBadge type={type} />

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
    borderRadius: radii.card,
  },
  card: {
    width: CARD_W,
    backgroundColor: colors.background.secondary,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.background.elevated,
    overflow: 'hidden',
    paddingTop: 12,
    paddingHorizontal: 12,
  },
  cardPressed: {
    opacity: 0.94,
  },
  body: {
    paddingHorizontal: 16,
    paddingLeft: 0,
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
