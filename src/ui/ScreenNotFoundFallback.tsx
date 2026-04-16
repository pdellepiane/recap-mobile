import { colors } from '@/src/ui/colors';
import { Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type ScreenNotFoundFallbackProps = {
  title: string;
  onBackPress: () => void;
  /** Defaults to “Volver”. */
  backLabel?: string;
};

/**
 * Centered message + back action inside a safe area — for missing entity screens (event, etc.).
 */
export function ScreenNotFoundFallback({
  title,
  onBackPress,
  backLabel = 'Volver',
}: ScreenNotFoundFallbackProps) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Text style={styles.title}>{title}</Text>
      <Pressable onPress={onBackPress} style={styles.btn}>
        <Text style={styles.btnText}>{backLabel}</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  title: {
    color: colors.neutral.primary,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
  },
  btn: {
    marginTop: 16,
    alignSelf: 'center',
    padding: 12,
  },
  btnText: {
    color: colors.states.active,
    fontSize: 16,
    fontWeight: '600',
  },
});
