import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { Button } from '@/src/ui';
import { colors } from '@/src/ui/colors';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, View } from 'react-native';

type StartButtonProps = {
  onPress: () => void | Promise<void>;
  bottomInset: number;
};

export function StartButton({ onPress, bottomInset }: StartButtonProps) {
  const { t } = useTranslation();

  return (
    <View style={[styles.buttonContainer, { paddingBottom: bottomInset + 20 }]}>
      <Button
        title={t('onboarding.start')}
        onPress={() => void onPress()}
        accessibilityLabel={t('onboarding.start')}
        rightIconSource={images.common.start}
        rightIconStyle={styles.buttonIcon}
        textStyle={styles.buttonText}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
    minWidth: 160,
    height: 64,
  },
  buttonText: {
    color: colors.neutral.primary,
    fontSize: 18,
    fontFamily: fontFamilies.bold,
  },
  buttonIcon: {
    width: 24,
    height: 24,
  },
});
