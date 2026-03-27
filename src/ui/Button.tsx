import { colors } from './colors';
import { fontFamilies } from './typography';
import { Pressable, StyleSheet, Text } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  style?: object;
};

export function Button({
  title,
  onPress,
  disabled = false,
  loading = false,
  loadingText,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const displayText = loading && loadingText ? loadingText : title;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        isDisabled && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <Text style={styles.buttonText}>{displayText}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.accent[500],
    borderRadius: 16,
    paddingVertical: 16,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: fontFamilies.bold,
  },
});
