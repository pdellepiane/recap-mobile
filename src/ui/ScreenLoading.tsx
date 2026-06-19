import { Spinner } from './Spinner';
import { colors } from '@/src/ui/colors';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Full-screen safe-area loading state (centered {@link Spinner}) for any screen.
 */
export function ScreenLoading() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Spinner style={styles.spinner} />
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
