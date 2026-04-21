import { BackButton, colors } from '@/src/ui';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Temporary empty shell for event detail while the full screen is not wired.
 */
export function EventDetailPlaceholderScreenPage() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <BackButton />
      </View>
      <View style={styles.body} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: 8,
    paddingTop: 4,
  },
  body: {
    flex: 1,
  },
});
