import { colors } from '@/src/ui';
import { Image, StyleSheet, View } from 'react-native';

const WEDDING_RANKING_SPRITE = require('../../../../../assets/images/event-detail/ranking/wedding-ranking-sprite.png');

/** Visible sprite window: width × height per column (4 columns in the PNG). */
const PRE_EVENT_CELL_W = 10;
const PRE_EVENT_CELL_H = 2;

export function EventDetailPreEventRankDecor({ slot }: { slot: 0 | 1 | 2 | 3 }) {
  return (
    <View style={styles.preEventIconWrap}>
      <Image
        source={WEDDING_RANKING_SPRITE}
        style={[styles.preEventSprite, { marginLeft: -slot * PRE_EVENT_CELL_W }]}
        resizeMode="cover"
        accessibilityRole="image"
        accessibilityLabel="Icono de ranking del evento"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  preEventIconWrap: {
    width: PRE_EVENT_CELL_W,
    height: PRE_EVENT_CELL_H,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: colors.overlay.white06,
  },
  preEventSprite: {
    width: PRE_EVENT_CELL_W * 4,
    height: PRE_EVENT_CELL_H,
  },
});
