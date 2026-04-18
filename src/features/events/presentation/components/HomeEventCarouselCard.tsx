import {
  eventDateBadgeParts,
  firstNameFromDisplayName,
  formatCarouselGuestCountLabel,
  getHomeCarouselScheduleKind,
} from '../utils/eventDisplay';
import type { Event } from '@/src/domain/entities';
import { useAuth } from '@/src/features/auth/presentation/context/AuthContext';
import { colors, HostInitialsAvatar, initialsFromFullName, parseHostsFromLine } from '@/src/ui';
import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const CARD_W = 280;
const IMG_H = 160;
const CARD_RADIUS = 28;
const FACEPILE_SIZE = 30;
const FACEPILE_RING = 3;
const COVER_CHIP = 28;
const FACEPILE_OVERLAP = Math.round(FACEPILE_SIZE * 0.38);

type CardVariant = 'hosted' | 'guest';

type Props = {
  event: Event;
  onPress: () => void;
  /** Stagger index for list entrance animation */
  index?: number;
  /** Guest “Planes” row uses “Por ti” + user initials; hosted rows use first host. */
  variant?: CardVariant;
};

export function HomeEventCarouselCard({ event, onPress, index = 0, variant = 'hosted' }: Props) {
  const { session } = useAuth();
  const { day, month } = eventDateBadgeParts(event.date);
  const guestLabel = formatCarouselGuestCountLabel(event.guestCount ?? 0);
  const scheduleKind = getHomeCarouselScheduleKind(event.date);

  const hostNames = parseHostsFromLine(event.hostsLine?.trim() ?? '');
  const firstHost = hostNames[0] ?? '';

  const faceNames =
    event.previewGuestNames && event.previewGuestNames.length > 0
      ? event.previewGuestNames.slice(0, 3)
      : hostNames.slice(0, 3);

  const coverInitials =
    variant === 'guest'
      ? initialsFromFullName(session?.user.name ?? '')
      : initialsFromFullName(firstHost);
  const coverLabel =
    variant === 'guest' ? 'Por ti' : firstHost ? firstNameFromDisplayName(firstHost) : 'Anfitrión';

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
          <View style={styles.imageWrap}>
            {event.coverImageUrl ? (
              <Image source={{ uri: event.coverImageUrl }} style={styles.image} />
            ) : (
              <View style={[styles.image, styles.imagePlaceholder]} />
            )}
            <View style={styles.dateBadge}>
              <Text style={styles.dateBadgeDay}>{day}</Text>
              <Text style={styles.dateBadgeMonth}>{month}</Text>
            </View>
            <View style={styles.coverFooter}>
              <View style={styles.coverChip}>
                <Text style={styles.coverChipInitials}>{coverInitials || '·'}</Text>
              </View>
              <Text style={styles.coverChipLabel} numberOfLines={1}>
                {coverLabel}
              </Text>
            </View>
          </View>

          <View style={styles.body}>
            {scheduleKind === 'live' ? (
              <View style={styles.liveRow}>
                <View style={styles.liveIconHalo}>
                  <View style={styles.liveIconDot} />
                </View>
                <Text style={styles.liveText}>Evento en vivo</Text>
              </View>
            ) : null}
            {scheduleKind === 'scheduled' ? (
              <View style={styles.scheduledWrap}>
                <View style={styles.scheduledRow}>
                  <View style={styles.scheduledIcon}>
                    <Ionicons name="time" size={12} color={colors.neutral.onLime} />
                  </View>
                  <Text style={styles.scheduledText}>Evento programado</Text>
                </View>
                <View style={styles.scheduledUnderline} />
              </View>
            ) : null}

            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {event.title}
            </Text>

            <View style={styles.guestRow}>
              {faceNames.length > 0 ? (
                <View style={styles.avatars}>
                  {faceNames.map((name, i) => (
                    <HostInitialsAvatar
                      key={`${name}-${i}`}
                      fullName={name}
                      colorIndex={i}
                      size={FACEPILE_SIZE}
                      appearance="pastel"
                      borderWidth={FACEPILE_RING}
                      borderColor={colors.background.primary}
                      style={
                        i > 0 ? { marginLeft: -FACEPILE_OVERLAP, zIndex: i + 1 } : { zIndex: 1 }
                      }
                    />
                  ))}
                </View>
              ) : null}
              <Text
                style={[styles.guests, faceNames.length === 0 && styles.guestsNoAvatars]}
                numberOfLines={1}
              >
                {guestLabel}
              </Text>
            </View>
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
  imageWrap: {
    height: IMG_H,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: colors.background.elevated,
  },
  dateBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    minWidth: 56,
    minHeight: 56,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: colors.overlay.black55,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateBadgeDay: {
    color: colors.neutral.primary,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 24,
  },
  dateBadgeMonth: {
    color: colors.neutral.primary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.6,
    marginTop: 2,
  },
  coverFooter: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  coverChip: {
    width: COVER_CHIP,
    height: COVER_CHIP,
    borderRadius: COVER_CHIP / 2,
    backgroundColor: colors.events.homeCardCoverTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverChipInitials: {
    color: colors.events.homeCardCoverOnTeal,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  coverChipLabel: {
    flex: 1,
    color: colors.neutral.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 8,
  },
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
    fontWeight: '600',
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
    backgroundColor: colors.events.homeCardScheduled,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduledText: {
    color: colors.events.homeCardScheduled,
    fontSize: 14,
    fontWeight: '600',
  },
  scheduledUnderline: {
    marginTop: 6,
    height: 1,
    width: '100%',
    backgroundColor: colors.countdown.cellBorder,
  },
  title: {
    color: colors.neutral.primary,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guests: {
    flex: 1,
    color: colors.neutral.primary,
    fontSize: 14,
    fontWeight: '400',
  },
  guestsNoAvatars: {
    marginLeft: 0,
  },
});
