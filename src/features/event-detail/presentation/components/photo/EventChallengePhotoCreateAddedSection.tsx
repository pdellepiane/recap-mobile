import type { PhotoCreateAddedChallenge } from '../../hooks/useEventChallengePhotoCreateScreen';
import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, StyleSheet, Text, View } from 'react-native';

type Props = {
  challenges: PhotoCreateAddedChallenge[];
};

/** Published photo challenges in this session (display only — no navigation). */
export function EventChallengePhotoCreateAddedSection({ challenges }: Props) {
  const { t } = useTranslation();

  if (challenges.length === 0) {
    return null;
  }

  return (
    <View style={styles.addedBlock}>
      <Text style={styles.sectionHeading}>{t('eventDetail.createPhotoAddedHeading')}</Text>
      {challenges.map((c) => (
        <View key={c.id} style={styles.addedCard} accessibilityLabel={c.title}>
          <Image
            source={images.eventDetail.challenges.createdQuestionIcon}
            style={styles.addedWatermark}
            resizeMode="contain"
          />
          <View style={styles.addedCardInner}>
            <View style={styles.addedCardBody}>
              <View style={styles.addedCardTextCol}>
                <View style={styles.validMetaRow}>
                  <Image
                    source={images.common.check}
                    style={styles.validMetaCheckIcon}
                    resizeMode="contain"
                    accessibilityElementsHidden
                  />
                  <Text style={styles.validMetaText} numberOfLines={2}>
                    <Text style={styles.validMetaLabel}>
                      {t('eventDetail.createPhotoAddedChallengeLabel')}
                    </Text>
                  </Text>
                </View>
                <Text style={styles.addedTitleText}>{c.title}</Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  addedBlock: {
    marginBottom: 20,
  },
  sectionHeading: {
    color: colors.neutral.lightest,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
    fontWeight: '600',
    marginBottom: 12,
  },
  addedCard: {
    borderRadius: 16,
    backgroundColor: colors.quizCreate.addedCard,
    marginBottom: 12,
    overflow: 'hidden',
    minHeight: 92,
  },
  addedWatermark: {
    position: 'absolute',
    left: -8,
    bottom: -16,
    width: 140,
    height: 140,
    opacity: 0.07,
  },
  addedCardInner: {
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  addedCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addedCardTextCol: {
    flex: 1,
    minWidth: 0,
  },
  validMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  validMetaCheckIcon: {
    width: 20,
    height: 20,
  },
  validMetaText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
    fontWeight: '600',
  },
  validMetaLabel: {
    color: colors.accent[500],
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
    fontWeight: '600',
  },
  addedTitleText: {
    color: colors.neutral.primary,
    fontSize: 20,
    lineHeight: 28,
    fontFamily: fontFamilies.signikaRegular,
    fontWeight: '400',
  },
});
