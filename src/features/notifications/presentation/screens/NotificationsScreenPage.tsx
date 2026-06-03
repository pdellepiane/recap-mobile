import { NOTIFICATION_LIST_HORIZONTAL_PADDING } from '../../data/notificationNavigation';
import { NotificationsEmptyState } from '../components/NotificationsEmptyState';
import { NotificationsList } from '../components/NotificationsList';
import { useNotificationsScreen } from '../hooks/useNotificationsScreen';
import { useTranslation } from '@/src/i18n';
import { colors, ScreenTitle } from '@/src/ui';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function NotificationsScreenPage() {
  const { t } = useTranslation();
  const { items, onNotificationPress } = useNotificationsScreen();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <ScreenTitle style={styles.title}>{t('tabs.notifications')}</ScreenTitle>
      </View>
      {items.length === 0 ? (
        <NotificationsEmptyState />
      ) : (
        <NotificationsList items={items} onItemPress={onNotificationPress} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: NOTIFICATION_LIST_HORIZONTAL_PADDING,
    paddingTop: 8,
  },
  title: {
    marginBottom: 8,
  },
});
