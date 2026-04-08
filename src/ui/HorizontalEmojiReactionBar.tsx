import type { SpawnFloatingReaction } from './FloatingReactions';
import { colors } from '@/src/ui/colors';
import { useRef } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type HorizontalEmojiReactionBarProps = {
  emojis: readonly string[];
  onSpawn: SpawnFloatingReaction;
  style?: StyleProp<ViewStyle>;
};

/**
 * Horizontal picker: tap spawns a reaction from the tapped cell center.
 */
export function HorizontalEmojiReactionBar({
  emojis,
  onSpawn,
  style,
}: HorizontalEmojiReactionBarProps) {
  const itemRefs = useRef<(View | null)[]>([]);

  return (
    <View style={[styles.row, style]}>
      {emojis.map((emoji, index) => (
        <Pressable
          key={`${emoji}-${String(index)}`}
          accessibilityRole="button"
          accessibilityLabel={`Reacción ${emoji}`}
          onPress={() => {
            itemRefs.current[index]?.measureInWindow((x, y, w, h) => {
              onSpawn(emoji, x + w / 2, y + h / 2);
            });
          }}
        >
          <View
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            collapsable={false}
            style={styles.cell}
          >
            <Text style={styles.emoji}>{emoji}</Text>
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
    gap: 8,
  },
  cell: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: colors.neutral.primary,
    backgroundColor: colors.overlay.black35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
  },
});
