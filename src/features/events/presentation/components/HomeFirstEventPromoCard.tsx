import { colors } from '@/src/ui';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

const SCREEN_W = Dimensions.get('window').width;
const HOME_CONTENT_INSET_LEFT = 20;
const CARD_W = SCREEN_W - HOME_CONTENT_INSET_LEFT;
const CARD_RADIUS = 24;

type Props = {
  /** Fired when tapping “IR A CREAR” (e.g. open Sin Envolturas on the web). */
  onPress?: () => void;
};

/**
 * “Create your first event” promo card (only when the user has no events from the API).
 */
export function HomeFirstEventPromoCard({ onPress }: Props) {
  return (
    <View style={styles.wrap} accessibilityRole="none">
      <View style={styles.card}>
        <View style={styles.leftCol}>
          <View style={styles.circle}>
            <Text style={styles.circleText}>{'CELEBRA REGALA Y\nRECIBE DINERO'}</Text>
          </View>
        </View>

        <View style={styles.rightCol}>
          <Text style={styles.line1}>Crea tu primer evento en</Text>

          <View style={styles.brandRow}>
            <View style={styles.logoRibbon} accessibilityLabel="">
              <View style={[styles.ribbonHalf, styles.ribbonHalfLeft]} />
              <View style={[styles.ribbonHalf, styles.ribbonHalfRight]} />
            </View>
            <Text style={styles.brand}>sin envolturas</Text>
          </View>

          <Pressable
            onPress={onPress}
            style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
            accessibilityRole="button"
            accessibilityLabel="Ir a crear tu primer evento"
          >
            <Text style={styles.ctaText}>IR A CREAR</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.background.primary} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: CARD_W,
    alignSelf: 'flex-start',
    marginLeft: HOME_CONTENT_INSET_LEFT,
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: CARD_W,
    backgroundColor: colors.background.elevated,
    borderRadius: CARD_RADIUS,
    paddingVertical: 18,
    paddingLeft: 14,
    paddingRight: 18,
    overflow: 'hidden',
  },
  leftCol: {
    marginRight: 10,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  circleText: {
    color: colors.states.active,
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 13,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    transform: [{ rotate: '-11deg' }],
    paddingHorizontal: 6,
  },
  rightCol: {
    flex: 1,
    justifyContent: 'center',
    gap: 12,
    minHeight: 120,
  },
  line1: {
    color: colors.neutral.primary,
    fontSize: 15,
    fontWeight: '500',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoRibbon: {
    width: 32,
    height: 22,
    position: 'relative',
  },
  ribbonHalf: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2.5,
    borderColor: colors.neutral.primary,
  },
  ribbonHalfLeft: {
    left: 0,
    top: 2,
  },
  ribbonHalfRight: {
    left: 12,
    top: 2,
  },
  brand: {
    color: colors.neutral.primary,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.states.active,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
    gap: 8,
  },
  ctaPressed: {
    opacity: 0.9,
  },
  ctaText: {
    color: colors.background.primary,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
});
