import {
  scaledOnboardingSize,
  useOnboardingScale,
} from '../utils/onboardingLayout';
import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { Button } from '@/src/ui';
import { colors } from '@/src/ui/colors';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

type StartButtonProps = {
  onPress: () => void | Promise<void>;
  bottomInset: number;
};

export function StartButton({ onPress, bottomInset }: StartButtonProps) {
  const { t } = useTranslation();
  const scale = useOnboardingScale();

  const layout = useMemo(
    () => ({
      minWidth: scaledOnboardingSize(160, scale),
      iconSize: scaledOnboardingSize(24, scale),
    }),
    [scale],
  );

  return (
    <View style={[styles.buttonContainer, { marginBottom: bottomInset }]}>
      <Button
        title={t('onboarding.start')}
        onPress={() => void onPress()}
        accessibilityLabel={t('onboarding.start')}
        rightIconSource={images.common.start}
        rightIconStyle={{ width: layout.iconSize, height: layout.iconSize }}
        textStyle={styles.buttonText}
        style={[styles.button, { minWidth: layout.minWidth }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.background.secondary,
  },
  buttonText: {
    color: colors.neutral.primary,
  },
});
