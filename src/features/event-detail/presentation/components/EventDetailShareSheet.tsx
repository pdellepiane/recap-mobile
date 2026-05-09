import { EventDetailShareUrlRow } from './EventDetailShareUrlRow';
import { useTranslation } from '@/src/i18n';
import { Button, CloseButton, SlideUpBottomModal, colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text } from 'react-native';

type Props = {
  visible: boolean;
  shareUrl: string;
  onClose: () => void;
  onShare: () => void;
};

export function EventDetailShareSheet({ visible, shareUrl, onClose, onShare }: Props) {
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
        accessibilityLabel={t('common.close')}
      />

      <Text style={styles.title}>{t('eventDetail.shareSheetTitle')}</Text>
      <Text style={styles.body}>{t('eventDetail.shareSheetBody')}</Text>

      <EventDetailShareUrlRow shareUrl={shareUrl} />

      <Button
        title={t('eventDetail.shareSheetShareAction')}
        onPress={onShare}
        accessibilityLabel={t('eventDetail.shareSheetShareAction')}
      />
    </SlideUpBottomModal>
  );
}

const styles = StyleSheet.create({
  overlayPadding: {
    paddingHorizontal: 22,
    paddingBottom: 52,
  },
  sheet: {
    borderRadius: 26,
    backgroundColor: colors.background.elevated,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 26,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  title: {
    color: colors.neutral.primary,
    fontSize: 28,
    fontWeight: '500',
    lineHeight: 36,
    fontFamily: fontFamilies.medium,
    marginTop: 50,
    marginBottom: 12,
  },
  body: {
    color: colors.neutral.primary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '300',
    fontFamily: fontFamilies.signikaLight,
    marginBottom: 22,
  },
});
