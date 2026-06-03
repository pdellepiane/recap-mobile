import type { MapAppOption } from '../../../data/mapApps';
import { useTranslation } from '@/src/i18n';
import { CloseButton, SlideUpBottomModal, colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  visible: boolean;
  apps: MapAppOption[];
  onClose: () => void;
  onSelectApp: (appId: MapAppOption['id']) => void;
};

export function EventDetailMapAppPickerSheet({ visible, apps, onClose, onSelectApp }: Props) {
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

      <Text style={styles.title}>{t('eventDetail.mapAppPickerTitle')}</Text>

      {apps.map((app) => (
        <Pressable
          key={app.id}
          onPress={() => onSelectApp(app.id)}
          style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
        >
          <Text style={styles.rowLabel}>{t(app.labelKey)}</Text>
        </Pressable>
      ))}
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
  title: {
    color: colors.neutral.primary,
    fontSize: 22,
    lineHeight: 30,
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
    marginTop: 44,
    marginBottom: 16,
  },
  row: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  rowPressed: {
    backgroundColor: colors.background.primaryOpacity5 ?? 'rgba(34,34,34,0.5)',
  },
  rowLabel: {
    color: colors.neutral.primary,
    fontSize: 18,
    lineHeight: 24,
    fontFamily: fontFamilies.signikaRegular,
  },
});
