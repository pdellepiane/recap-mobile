import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { Button, colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, StyleSheet, Text, View } from 'react-native';

type Props = {
  displayNumber: number;
  summaryLine: string;
  thumbUri: string | null;
  pointsEarned: number;
  onOpenRanking: () => void;
};

export function EventChallengePhotoCompletedBody({
  displayNumber,
  summaryLine,
  thumbUri,
  pointsEarned,
  onOpenRanking,
}: Props) {
  const { t } = useTranslation();
  const rankingLabel = t('common.viewRanking');

  return (
    <View style={styles.resultContent}>
      <View style={styles.resultIconWrap} pointerEvents="none">
        <View style={styles.resultIconCircle}>
          <Image
            source={images.common.checkGreen}
            style={styles.iconCheck}
            resizeMode="contain"
            accessibilityElementsHidden
          />
        </View>
      </View>

      <Text style={styles.challengeKicker}>
        {t('challenges.challengeNumberLabel', { n: displayNumber })}
      </Text>
      <Text style={styles.resultTitle}>{t('challenges.completedTitle')}</Text>

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
        <Text style={styles.pointsText}>
          {t('challenges.pointsEarned', { points: pointsEarned })}
        </Text>
      </View>

      <Button
        title={rankingLabel}
        onPress={onOpenRanking}
        accessibilityLabel={rankingLabel}
        style={styles.rankingBtn}
        rightIconSource={images.common.goToRight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  resultContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  resultIconWrap: {
    width: 91,
    height: 91,
    marginBottom: 20,
  },
  resultIconCircle: {
    width: 91,
    height: 91,
    borderRadius: 45.5,
    backgroundColor: colors.neutral.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCheck: {
    width: 52,
    height: 52,
  },
  challengeKicker: {
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
    color: colors.background.primary,
    fontFamily: fontFamilies.signikaRegular,
    marginBottom: 6,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '500',
    lineHeight: 36,
    color: colors.background.primary,
    fontFamily: fontFamilies.medium,
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
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.accent[600],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  pointsText: {
    color: colors.neutral.disabled,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    fontFamily: fontFamilies.semiBold,
  },
  rankingBtn: {
    width: '100%',
    backgroundColor: colors.neutral.primary,
  },
  pressed: {
    opacity: 0.88,
  },
});
