import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  circleTop: number;
  displayNumber: number;
  summaryLine: string;
  thumbUri: string | null;
  points: number;
  onOpenRanking: () => void;
};

export function EventChallengePhotoCompletedBody({
  circleTop,
  displayNumber,
  summaryLine,
  thumbUri,
  points,
  onOpenRanking,
}: Props) {
  const { t } = useTranslation();
  return (
    <View style={[styles.content, { paddingTop: circleTop + 44 }]}>
      <View style={styles.iconWrap} pointerEvents="none">
        <View style={styles.iconCircle}>
          <FontAwesome5 name="check" size={48} color={colors.states.active} solid />
        </View>
      </View>

      <Text style={styles.challengeKicker}>
        {t('challenges.challengeNumberLabel', { n: displayNumber })}
      </Text>
      <Text style={styles.title}>{t('challenges.completedTitle')}</Text>

      <View style={styles.summaryCard}>
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Image
            source={images.eventDetail.challenges.cardDecorUnion}
            style={styles.cardDecor}
            resizeMode="contain"
          />
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText} numberOfLines={4}>
            {summaryLine}
          </Text>
          {thumbUri ? (
            <Image
              source={{ uri: thumbUri }}
              style={styles.thumb}
              resizeMode="cover"
              accessibilityIgnoresInvertColors
            />
          ) : (
            <View style={styles.thumbPlaceholder} />
          )}
        </View>
      </View>

      <View style={styles.pointsPill} pointerEvents="none">
        <Text style={styles.pointsText}>{t('challenges.pointsEarned', { points })}</Text>
      </View>

      <Pressable
        onPress={onOpenRanking}
        style={({ pressed }) => [styles.rankingBtn, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={t('common.viewRanking')}
      >
        <Text style={styles.rankingBtnText}>{t('common.viewRanking')}</Text>
        <Ionicons name="arrow-forward" size={22} color={colors.background.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  iconWrap: {
    marginBottom: 12,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.neutral.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeKicker: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.background.elevated,
    marginBottom: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.background.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  summaryCard: {
    width: '100%',
    borderRadius: 22,
    backgroundColor: colors.background.tertiary,
    overflow: 'hidden',
    marginBottom: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  cardDecor: {
    position: 'absolute',
    left: -16,
    top: -20,
    width: 200,
    height: 200,
    opacity: 0.28,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  summaryText: {
    flex: 1,
    color: colors.neutral.primary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  thumb: {
    width: 76,
    height: 102,
    borderRadius: 10,
    backgroundColor: colors.background.secondary,
  },
  thumbPlaceholder: {
    width: 76,
    height: 102,
    borderRadius: 10,
    backgroundColor: colors.background.secondary,
  },
  pointsPill: {
    width: '100%',
    minHeight: 52,
    borderRadius: 999,
    backgroundColor: colors.states.active,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  pointsText: {
    color: colors.background.primary,
    fontSize: 17,
    fontWeight: '700',
  },
  rankingBtn: {
    width: '100%',
    minHeight: 58,
    borderRadius: 999,
    backgroundColor: colors.neutral.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
  },
  rankingBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.background.primary,
  },
  pressed: {
    opacity: 0.88,
  },
});
