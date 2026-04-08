import { eventDateBadgeParts } from '../utils/eventDisplay';
import type { Event } from '@/src/domain/entities';
import { colors } from '@/src/ui';
import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

const CARD_W = 268;
const IMG_H = 148;
const AVATAR = 28;

type Props = {
  event: Event;
  onPress: () => void;
};

export function HomeEventCarouselCard({ event, onPress }: Props) {
  const { day, month } = eventDateBadgeParts(event.date);
  const guestLabel = '+20 invitados';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={event.title}
    >
      <View style={styles.imageWrap}>
        {event.coverImageUrl ? (
          <Image source={{ uri: event.coverImageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]} />
        )}
        <View style={styles.badge}>
          <Text style={styles.badgeDay}>{day}</Text>
          <Text style={styles.badgeMonth}>{month}</Text>
        </View>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {event.title}
      </Text>
      <View style={styles.guestRow}>
        <View style={styles.avatars}>
          <View style={[styles.avatar, styles.avatar1]} />
          <View style={[styles.avatar, styles.avatar2]} />
          <View style={[styles.avatar, styles.avatar3]} />
        </View>
        <Text style={styles.guests}>{guestLabel}</Text>
      </View>
      <View style={styles.locRow}>
        <Ionicons name="location-sharp" size={16} color={colors.events.locationPin} />
        <Text style={styles.location} numberOfLines={1}>
          {event.location}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_W,
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.background.elevated,
    padding: 10,
    marginRight: 14,
  },
  cardPressed: {
    opacity: 0.92,
  },
  imageWrap: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
    height: IMG_H,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: colors.background.elevated,
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: colors.overlay.black55,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
  },
  badgeDay: {
    color: colors.neutral.primary,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
  },
  badgeMonth: {
    color: colors.neutral.primary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  title: {
    color: colors.neutral.primary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    minHeight: 42,
  },
  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  avatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    borderWidth: 2,
    borderColor: colors.background.secondary,
    marginRight: -10,
  },
  avatar1: {
    backgroundColor: colors.brand[400],
    zIndex: 3,
  },
  avatar2: {
    backgroundColor: colors.states.error,
    zIndex: 2,
  },
  avatar3: {
    backgroundColor: colors.states.active,
    zIndex: 1,
    marginRight: 0,
  },
  guests: {
    color: colors.events.guestsOnCard,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  location: {
    color: colors.neutral.primary,
    fontSize: 13,
    flex: 1,
  },
});
