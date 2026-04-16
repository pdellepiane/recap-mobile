import { colors } from '@/src/ui/colors';
import { Spinner } from './Spinner';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type ScreenLoadingProps = {
  /** Spinner tint; defaults to active/brand accent. */
  color?: string;
};

/**
 * Full-screen safe-area loading state (centered {@link Spinner}) for any screen.
 */
export function ScreenLoading({ color = colors.states.active }: ScreenLoadingProps) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Spinner color={color} style={styles.spinner} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
  },
  spinner: {
    flex: 1,
  },
});
