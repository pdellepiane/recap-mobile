import { EventDetailCreateChallengePhotoOption } from './EventDetailCreateChallengePhotoOption';
import { EventDetailCreateChallengeQuizOption } from './EventDetailCreateChallengeQuizOption';
import { useTranslation } from '@/src/i18n';
import { CloseButton, SlideUpBottomModal, colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelectQuiz: () => void;
  onSelectPhoto: () => void;
};

export function EventDetailCreateChallengeSheet({
  visible,
  onClose,
  onSelectQuiz,
  onSelectPhoto,
}: Props) {
  const { t } = useTranslation();

  return (
    <SlideUpBottomModal
      visible={visible}
      onRequestClose={onClose}
      contentContainerStyle={styles.overlayPadding}
      sheetStyle={styles.sheet}
    >
      <CloseButton
        onPress={onClose}
        style={styles.closeBtn}
        iconStyle={styles.closeIcon}
        accessibilityLabel={t('common.close')}
      />

      <Text style={styles.title}>{t('eventDetail.challengeTypeSheetTitle')}</Text>
      <Text style={styles.subtitle}>{t('eventDetail.challengeTypeSheetBody')}</Text>

      <EventDetailCreateChallengeQuizOption onPress={onSelectQuiz} />
      <EventDetailCreateChallengePhotoOption onPress={onSelectPhoto} />
    </SlideUpBottomModal>
  );
}

const styles = StyleSheet.create({
  overlayPadding: {
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  sheet: {
    borderRadius: 28,
    backgroundColor: colors.background.elevated,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 26,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    width: 18,
    height: 18,
  },
  title: {
    color: colors.neutral.primary,
    fontSize: 28,
    lineHeight: 36,
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 44,
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
