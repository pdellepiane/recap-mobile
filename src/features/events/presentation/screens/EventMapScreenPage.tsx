import { useEventMapScreen } from '../hooks/useEventMapScreen';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { Spinner, colors } from '@/src/ui';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

type EventMapScreenPageProps = {
  eventId: string;
  /** Si viene de la navegación (query `q`), no hace falta esperar al evento. */
  initialQuery?: string;
};

export function EventMapScreenPage({ eventId, initialQuery }: EventMapScreenPageProps) {
  const { goBack } = useCoordinator();
  const { showLoader, uri } = useEventMapScreen({ eventId, initialQuery });

  if (showLoader) {
    return (
      <SafeAreaView style={[styles.safe, styles.centered]} edges={['top', 'bottom']}>
        <Spinner color={colors.states.active} />
      </SafeAreaView>
    );
  }

  if (!uri) {
    return (
      <SafeAreaView style={[styles.safe, styles.centered]} edges={['top', 'bottom']}>
        <Text style={styles.errorText}>No hay ubicación para este evento.</Text>
        <Pressable onPress={goBack} style={styles.fallbackBtn} accessibilityRole="button">
          <Text style={styles.fallbackBtnText}>Volver</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.safe}>
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={goBack}
            style={({ pressed }) => [styles.backCircle, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Volver"
          >
            <Ionicons name="chevron-back" size={26} color={colors.neutral.primary} />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Ubicación
          </Text>
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
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
  errorText: {
    color: colors.neutral.secondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  fallbackBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.states.active,
  },
  fallbackBtnText: {
    color: colors.background.primary,
    fontWeight: '700',
    fontSize: 16,
  },
});
