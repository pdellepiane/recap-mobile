import type { MapAppOption } from '../../../data/mapApps';
import { useTranslation } from '@/src/i18n';
import { CloseButton, SlideUpBottomModal, colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  visible: boolean;
  apps: MapAppOption[];
  onClose: () => void;
  onSelectApp: (appId: MapAppOption['id']) => void;
};

type MapAppPickerRowProps = {
  app: MapAppOption;
  label: string;
  onSelectApp: (appId: MapAppOption['id']) => void;
};

const MapAppPickerRow = memo(function MapAppPickerRow({
  app,
  label,
  onSelectApp,
}: MapAppPickerRowProps) {
  const onPress = useCallback(() => onSelectApp(app.id), [app.id, onSelectApp]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <Text style={styles.rowLabel}>{label}</Text>
    </Pressable>
  );
});

export const EventDetailMapAppPickerSheet = memo(function EventDetailMapAppPickerSheet({
  visible,
  apps,
  onClose,
  onSelectApp,
}: Props) {
  const { t } = useTranslation();

  return (
    <SlideUpBottomModal visible={visible} onRequestClose={onClose}>
      <CloseButton
        onPress={onClose}
        style={styles.closeBtn}
        accessibilityLabel={t('common.close')}
      />

      <Text style={styles.title}>{t('eventDetail.mapAppPickerTitle')}</Text>

      {apps.map((app) => (
        <MapAppPickerRow
          key={app.id}
          app={app}
          label={t(app.labelKey)}
          onSelectApp={onSelectApp}
        />
      ))}
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
