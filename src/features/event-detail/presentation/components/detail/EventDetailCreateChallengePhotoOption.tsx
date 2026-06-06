import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { Button, colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type Props = {
  onPress: () => void;
};

export const EventDetailCreateChallengePhotoOption = memo(function EventDetailCreateChallengePhotoOption({
  onPress,
}: Props) {
  const { t } = useTranslation();

  return (
    <Button
      onPress={onPress}
      style={[styles.optionCard, styles.optionCardPhoto]}
      accessibilityLabel={t('eventDetail.challengeTypePhotoTitle')}
    >
      <Image
        source={images.eventDetail.challenges.createPhotoChallengeIcon}
        style={styles.optionIcon}
        resizeMode="contain"
      />
      <View style={styles.optionTextCol}>
        <Text style={styles.optionTitle}>{t('eventDetail.challengeTypePhotoTitle')}</Text>
        <Text style={styles.optionBody}>{t('eventDetail.challengeTypePhotoBody')}</Text>
      </View>
    </Button>
  );
});

const styles = StyleSheet.create({
  optionCard: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  optionCardPhoto: {
    backgroundColor: colors.accent[200],
  },
  optionIcon: {
    width: 56,
    height: 56,
  },
  optionTextCol: {
    flex: 1,
    marginLeft: 14,
  },
  optionTitle: {
    color: colors.background.primary,
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
    fontFamily: fontFamilies.signikaRegular,
  },
  optionBody: {
    color: colors.background.primary,
    fontSize: 14,
    fontWeight: '300',
    lineHeight: 20,
    fontFamily: fontFamilies.signikaLight,
  },
});
