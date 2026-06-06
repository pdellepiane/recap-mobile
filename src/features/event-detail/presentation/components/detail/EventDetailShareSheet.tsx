import { EventDetailShareUrlRow } from './EventDetailShareUrlRow';
import { useTranslation } from '@/src/i18n';
import { Button, CloseButton, SlideUpBottomModal, colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { memo } from 'react';
import { StyleSheet, Text } from 'react-native';

type Props = {
  visible: boolean;
  shareUrl: string;
  onClose: () => void;
  onShare: () => void;
};

export const EventDetailShareSheet = memo(function EventDetailShareSheet({
  visible,
  shareUrl,
  onClose,
  onShare,
}: Props) {
  const { t } = useTranslation();

  return (
    <SlideUpBottomModal visible={visible} onRequestClose={onClose}>
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
  body: {
    color: colors.neutral.primary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '300',
    fontFamily: fontFamilies.signikaLight,
    marginBottom: 22,
  },
});
