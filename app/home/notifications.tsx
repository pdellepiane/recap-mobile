import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationsRoute() {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.center}>
        <Text style={styles.title}>{t('tabs.notifications')}</Text>
        <Text style={styles.muted}>{t('home.notificationsEmpty')}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.neutral.primary,
  },
  muted: {
    fontSize: 16,
    color: colors.neutral.tertiary,
    textAlign: 'center',
  },
});
