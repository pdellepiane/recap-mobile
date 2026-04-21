import { colors, HostInitialsAvatar } from '@/src/ui';
import { StyleSheet, Text, View } from 'react-native';

const FACEPILE_SIZE = 30;
const FACEPILE_RING = 3;
const FACEPILE_OVERLAP = Math.round(FACEPILE_SIZE * 0.38);

type Props = {
  faceNames: string[];
  guestLabel: string;
};

/** Fila de avatares superpuestos + texto de invitados en la tarjeta del carrusel. */
export function HomeEventCarouselGuestRow({ faceNames, guestLabel }: Props) {
  return (
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
              style={i > 0 ? { marginLeft: -FACEPILE_OVERLAP, zIndex: i + 1 } : { zIndex: 1 }}
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
  );
}

const styles = StyleSheet.create({
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
    lineHeight: 20,
  },
  guestsNoAvatars: {
    marginLeft: 0,
  },
});
