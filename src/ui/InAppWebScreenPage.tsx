import { useCoordinator } from '@/src/navigation/useCoordinator';
import { colors } from '@/src/ui/colors';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export type InAppWebScreenPageProps = {
  uri: string;
  /** Header title; empty hides the title text but keeps layout. */
  title?: string;
};

/**
 * Full-screen in-app browser: back control + {@link WebView} (same chrome as the event map screen).
 */
export function InAppWebScreenPage({ uri, title }: InAppWebScreenPageProps) {
  const { goBack } = useCoordinator();

  return (
    <View style={styles.safe}>
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={goBack}
            style={({ pressed }) => [styles.backCircle, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={26} color={colors.neutral.primary} />
          </Pressable>
          {title ? (
            <Text style={styles.headerTitle} numberOfLines={1}>
              {title}
            </Text>
          ) : (
            <View style={styles.headerTitle} />
          )}
          <View style={styles.headerSide} />
        </View>
      </SafeAreaView>

      <WebView
        source={{ uri }}
        style={styles.webview}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.webLoading}>
            <ActivityIndicator size="large" color={colors.states.active} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  headerSafe: {
    backgroundColor: colors.background.primary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.background.tertiary,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
  },
  backCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.overlay.white08,
  },
  pressed: {
    opacity: 0.85,
  },
  headerTitle: {
    flex: 1,
    color: colors.neutral.primary,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerSide: {
    width: 44,
  },
  webview: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  webLoading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
});
