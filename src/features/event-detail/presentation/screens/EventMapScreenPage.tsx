import { useEventMapScreen } from '../hooks/useEventMapScreen';
import { useTranslation } from '@/src/i18n';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { BackButton, Button, Spinner, colors } from '@/src/ui';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

type EventMapScreenPageProps = {
  eventId: string;
  /** When opened via navigation (query `q`), no need to wait for event data. */
  initialQuery?: string;
};

export function EventMapScreenPage({ eventId, initialQuery }: EventMapScreenPageProps) {
  const { t } = useTranslation();
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
        <Text style={styles.errorText}>{t('map.noLocation')}</Text>
        <Button
          title={t('common.back')}
          onPress={goBack}
          variant="active"
          accessibilityLabel={t('common.back')}
          style={styles.fallbackBtn}
          textStyle={styles.fallbackBtnText}
        />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.safe}>
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.headerRow}>
          <BackButton
            style={styles.backCircle}
            iconStyle={styles.backIcon}
            accessibilityLabel={t('common.back')}
          />
          <Text style={styles.headerTitle} numberOfLines={1}>
            {t('map.title')}
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
    marginBottom: 0,
    backgroundColor: colors.overlay.white08,
  },
  backIcon: {
    width: 20,
    height: 20,
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
    height: undefined,
    minHeight: 48,
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
