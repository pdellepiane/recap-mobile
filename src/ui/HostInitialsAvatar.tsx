import { colors } from './colors';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

const HOST_AVATAR_BACKGROUNDS = [
  colors.brand[500],
  colors.states.error,
  colors.accent[600],
  colors.brand[400],
] as const;

const PASTEL_BACKGROUNDS = [
  colors.events.homeCardPastelMint,
  colors.events.homeCardPastelSky,
  colors.events.homeCardPastelLilac,
] as const;

const AVATAR_SIZE = 36;

/**
 * Splits a hosts display line into individual names (Spanish " y ", commas).
 */
export function parseHostsFromLine(hostsLine: string): string[] {
  const trimmed = hostsLine.trim();
  if (!trimmed) {
    return [];
  }
  const segments = trimmed
    .split(/\s*,\s*|\s+y\s+/i)
    .map((s) => s.trim())
    .filter(Boolean);
  return segments.length > 0 ? segments : [trimmed];
}

/**
 * First letter of first name + first letter of last name; single token uses first two letters.
 */
export function initialsFromFullName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  if (parts.length >= 2) {
    const first = parts[0].charAt(0);
    const last = parts[parts.length - 1].charAt(0);
    return `${first}${last}`.toUpperCase();
  }
  const w = parts[0];
  if (w.length >= 2) {
    return `${w.charAt(0)}${w.charAt(1)}`.toUpperCase();
  }
  return w.toUpperCase();
}

type HostInitialsAvatarProps = {
  fullName: string;
  colorIndex: number;
  /** Defaults to {@link AVATAR_SIZE} (event detail row). */
  size?: number;
  borderColor?: string;
  /** Ring width; home carousel facepile uses a thicker stroke for overlap separation. */
  borderWidth?: number;
  /** Pastel fills + dark initials (home carousel facepile). */
  appearance?: 'solid' | 'pastel';
  style?: StyleProp<ViewStyle>;
};

export function HostInitialsAvatar({
  fullName,
  colorIndex,
  size = AVATAR_SIZE,
  borderColor = colors.background.primary,
  borderWidth: ringWidth = 2,
  appearance = 'solid',
  style,
}: HostInitialsAvatarProps) {
  const initials = initialsFromFullName(fullName);
  const palette = appearance === 'pastel' ? PASTEL_BACKGROUNDS : HOST_AVATAR_BACKGROUNDS;
  const bg = palette[colorIndex % palette.length];
  const fontSize = Math.max(9, Math.round(size * 0.34));
  const initialsColor = appearance === 'pastel' ? colors.neutral.onLime : colors.neutral.primary;

  return (
    <View
      style={[
        styles.circleBase,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: ringWidth,
          borderColor,
          backgroundColor: bg,
        },
        style,
      ]}
    >
      <Text style={[styles.initials, { fontSize, color: initialsColor }]} numberOfLines={1}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circleBase: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '700',
    letterSpacing: -0.3,
  },
});
