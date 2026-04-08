import { colors } from '@/src/ui';
import { StyleSheet, Text, View } from 'react-native';

const COLORS = {
  screen: colors.background.primary,
  circle: colors.background.elevated,
  purple: colors.brand[700],
  white: colors.neutral.primary,
  subtext: colors.neutral.tertiary,
};

const CIRCLE_SIZE = 172;

export function HomeEmptyState() {
  return (
    <View style={styles.root}>
      <View style={styles.circle}>
        <View style={styles.calendar}>
          <View style={styles.hooksRow}>
            <View style={styles.hook} />
            <View style={styles.hook} />
          </View>
          <View style={styles.header} />
          <View style={styles.body}>
            <Text style={styles.dayNumber}>18</Text>
          </View>
        </View>
      </View>

      <Text style={styles.title}>No tienes ningún evento</Text>
      <Text style={styles.subtitle}>
        Empieza a crear tus eventos en nuestra página{' '}
        <Text style={styles.subtitleBrand}>Sin Envolturas</Text>
      </Text>
    </View>
  );
}

const CAL_W = 108;

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    marginTop: 90,
    paddingTop: 0,
    paddingBottom: 40,
    backgroundColor: 'transparent',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: COLORS.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  calendar: {
    width: CAL_W,
    alignItems: 'center',
  },
  hooksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 64,
    marginBottom: -6,
    zIndex: 2,
  },
  hook: {
    width: 8,
    height: 14,
    borderRadius: 4,
    backgroundColor: COLORS.white,
  },
  header: {
    width: CAL_W,
    height: 26,
    backgroundColor: COLORS.purple,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  body: {
    width: CAL_W,
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    // Long flat-style shadow (simplified)
    shadowColor: colors.background.primary,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 0,
    elevation: 4,
  },
  dayNumber: {
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.purple,
  },
  title: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: COLORS.subtext,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 320,
  },
  subtitleBrand: {
    fontWeight: '700',
    color: COLORS.subtext,
  },
});
