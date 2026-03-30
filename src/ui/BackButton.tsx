import { useCoordinator } from '../navigation/useCoordinator';
import { colors } from './colors';
import { Image, Pressable, StyleSheet, ViewStyle } from 'react-native';

type BackButtonProps = {
  style?: ViewStyle | ViewStyle[];
  hitSlop?: number;
};

export function BackButton({ style, hitSlop = 12 }: BackButtonProps) {
  const { goBack } = useCoordinator();
  return (
    <Pressable
      style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed, style]}
      onPress={goBack}
      hitSlop={hitSlop}
    >
      <Image
        source={require('../../assets/images/common/back-icon.png')}
        style={styles.backIcon}
        resizeMode="contain"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButtonPressed: {
    opacity: 0.82,
  },
  backIcon: {
    width: 18,
    height: 30,
  },
});
