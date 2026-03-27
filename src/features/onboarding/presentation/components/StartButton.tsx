import { colors } from '@/src/ui/colors';
import { fontFamilies } from '@/src/ui/typography';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type StartButtonProps = {
  onPress: () => void | Promise<void>;
  bottomInset: number;
};

export function StartButton({ onPress, bottomInset }: StartButtonProps) {
  return (
    <View style={[styles.buttonContainer, { paddingBottom: bottomInset + 20 }]}>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>Empezar</Text>
        <Image
          source={require('../../../../../assets/images/common/start-icon.png')}
          style={styles.buttonIcon}
          resizeMode="contain"
        />
      </Pressable>
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
  buttonPressed: {
    opacity: 0.9,
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
