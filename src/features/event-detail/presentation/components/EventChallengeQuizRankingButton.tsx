import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  onPress: () => void;
};

export function EventChallengeQuizRankingButton({ onPress }: Props) {
  const { t } = useTranslation();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.rankingBtn, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={t('common.viewRanking')}
    >
      <Text style={styles.rankingBtnText}>{t('common.viewRanking')}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.background.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  rankingBtn: {
    width: '100%',
    height: 60,
    borderRadius: 18,
    backgroundColor: colors.neutral.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  rankingBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.background.primary,
    lineHeight: 16,
    fontFamily: fontFamilies.bold,
  },
  pressed: { opacity: 0.85 },
});
