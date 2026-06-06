import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { Button, colors } from '@/src/ui';
import { StyleSheet } from 'react-native';

type Props = {
  onPress: () => void;
};

export function EventChallengePhotoOpenCameraButton({ onPress }: Props) {
  const { t } = useTranslation();

  return (
    <Button
      title={t('common.takePhoto')}
      onPress={onPress}
      accessibilityLabel={t('common.takePhoto')}
      style={styles.cta}
      variant="secondary"
      rightIconSource={images.common.camera.icon}
      rightIconStyle={styles.ctaCameraIcon}
    />
  );
}

const styles = StyleSheet.create({
  cta: {
    alignSelf: 'center',
    marginTop: 150,
    minWidth: 200,
  },
  ctaCameraIcon: {
    width: 20,
    height: 20,
    tintColor: colors.background.primary,
  },
});
