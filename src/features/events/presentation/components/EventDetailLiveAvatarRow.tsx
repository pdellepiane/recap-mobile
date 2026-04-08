import { colors } from '@/src/ui';
import { useRef } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Image, Pressable, StyleSheet, View } from 'react-native';

const AVATAR = 100;
const EMOJI = 44;
const REACTION_IMG = 28;

const REACTION_A11Y = ['Fiesta', 'Triste', 'Risa', 'Corazones'] as const;

type Props = {
  profileImage: ImageSourcePropType;
  /** Four reactions in order: left×2, right×2 (local assets or URI). */
  reactionSources: readonly [
    ImageSourcePropType,
    ImageSourcePropType,
    ImageSourcePropType,
    ImageSourcePropType,
  ];
  /** When set, each tap measures the window center and triggers the floating animation. */
  onReactionPress?: (source: ImageSourcePropType, center: { x: number; y: number }) => void;
  /** Tap on the center avatar (e.g. open stories). */
  onProfileAvatarPress?: () => void;
};

/**
 * “Live execution” detail row: reactions in circles + center avatar with lime border.
 */
export function EventDetailLiveAvatarRow({
  profileImage,
  reactionSources,
  onReactionPress,
  onProfileAvatarPress,
}: Props) {
  const [r0, r1, r2, r3] = reactionSources;
  const itemRefs = useRef<(View | null)[]>([]);

  const handlePress = (index: number, source: ImageSourcePropType) => {
    if (!onReactionPress) {
      return;
    }
    itemRefs.current[index]?.measureInWindow((x, y, w, h) => {
      onReactionPress(source, { x: x + w / 2, y: y + h / 2 });
    });
  };

  const cells = [
    { source: r0, index: 0 },
    { source: r1, index: 1 },
    { source: r2, index: 2 },
    { source: r3, index: 3 },
  ] as const;

  return (
    <View style={styles.row}>
      {cells.slice(0, 2).map(({ source, index }) => (
        <Pressable
          key={index}
          accessibilityRole="button"
          accessibilityLabel={`Reacción ${REACTION_A11Y[index] ?? ''}`}
          onPress={() => handlePress(index, source)}
          disabled={!onReactionPress}
        >
          <View
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            collapsable={false}
            style={styles.emojiCircle}
          >
            <Image source={source} style={styles.reactionImg} resizeMode="contain" />
          </View>
        </Pressable>
      ))}
      {onProfileAvatarPress ? (
        <Pressable
          onPress={onProfileAvatarPress}
          accessibilityRole="button"
          accessibilityLabel="Ver estados"
        >
          <Image source={profileImage} style={styles.avatar} />
        </Pressable>
      ) : (
        <Image source={profileImage} style={styles.avatar} />
      )}
      {cells.slice(2, 4).map(({ source, index }) => (
        <Pressable
          key={index}
          accessibilityRole="button"
          accessibilityLabel={`Reacción ${REACTION_A11Y[index] ?? ''}`}
          onPress={() => handlePress(index, source)}
          disabled={!onReactionPress}
        >
          <View
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            collapsable={false}
            style={styles.emojiCircle}
          >
            <Image source={source} style={styles.reactionImg} resizeMode="contain" />
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: -AVATAR / 2,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  emojiCircle: {
    width: EMOJI,
    height: EMOJI,
    borderRadius: EMOJI / 2,
    backgroundColor: colors.overlay.black45,
    borderWidth: 3,
    borderColor: colors.neutral.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactionImg: {
    width: REACTION_IMG,
    height: REACTION_IMG,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    borderWidth: 4,
    borderColor: colors.states.active,
  },
});
