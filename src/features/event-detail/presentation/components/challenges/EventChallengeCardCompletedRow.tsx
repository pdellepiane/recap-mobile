import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

const CHALLENGE_ACCENT_LIME = colors.states.active;

type Props = {
  isQuiz: boolean;
  pointsShown: number;
  zeroPoints: boolean;
};

export function EventChallengeCardCompletedRow({ isQuiz, pointsShown, zeroPoints }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.row} pointerEvents="none">
      <Ionicons name="checkmark" size={20} color={colors.neutral.primary} />
      <Text style={[styles.label, isQuiz ? styles.labelQuiz : styles.labelPhoto]}>
        {t('challenges.completedBadge')}
      </Text>
      <Text style={[styles.points, zeroPoints && styles.pointsZero]}>
        {t('challenges.pointsShort', { points: pointsShown })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  labelQuiz: {
    color: colors.brand[300],
  },
  labelPhoto: {
    color: CHALLENGE_ACCENT_LIME,
  },
  points: {
    color: CHALLENGE_ACCENT_LIME,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    fontFamily: fontFamilies.signikaRegular,
  },
  pointsZero: {
    color: colors.states.error,
  },
});
