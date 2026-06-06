import { EventDetailCreateChallengePhotoOption } from './EventDetailCreateChallengePhotoOption';
import { EventDetailCreateChallengeQuizOption } from './EventDetailCreateChallengeQuizOption';
import { useTranslation } from '@/src/i18n';
import { CloseButton, SlideUpBottomModal, colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { memo } from 'react';
import { StyleSheet, Text } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelectQuiz: () => void;
  onSelectPhoto: () => void;
};

export const EventDetailCreateChallengeSheet = memo(function EventDetailCreateChallengeSheet({
  visible,
  onClose,
  onSelectQuiz,
  onSelectPhoto,
}: Props) {
  const { t } = useTranslation();

  return (
    <SlideUpBottomModal visible={visible} onRequestClose={onClose}>
      <CloseButton
        onPress={onClose}
        style={styles.closeBtn}
        accessibilityLabel={t('common.close')}
      />

      <Text style={styles.title}>{t('eventDetail.challengeTypeSheetTitle')}</Text>
      <Text style={styles.subtitle}>{t('eventDetail.challengeTypeSheetBody')}</Text>

      <EventDetailCreateChallengeQuizOption onPress={onSelectQuiz} />
      <EventDetailCreateChallengePhotoOption onPress={onSelectPhoto} />
    </SlideUpBottomModal>
  );
});

const styles = StyleSheet.create({
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  title: {
    color: colors.neutral.primary,
    fontSize: 28,
    lineHeight: 36,
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
    marginTop: 50,
    marginBottom: 12,
  },
  subtitle: {
    color: colors.neutral.primary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '300',
    fontFamily: fontFamilies.signikaLight,
    marginBottom: 20,
  },
});
