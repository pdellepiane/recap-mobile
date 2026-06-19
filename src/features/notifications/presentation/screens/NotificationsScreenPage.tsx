import { NotificationsEmptyState } from '../components/NotificationsEmptyState';
import { NotificationsHeader } from '../components/NotificationsHeader';
import { NotificationsList } from '../components/NotificationsList';
import { useNotificationsScreen } from '../hooks/useNotificationsScreen';
import { useTranslation } from '@/src/i18n';
import { colors, ScreenLoading } from '@/src/ui';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function NotificationsScreenPage() {
  const { t } = useTranslation();
  const {
    items,
    isLoading,
    isRefreshing,
    isLoadingMore,
    onNotificationPress,
    onRefresh,
    onLoadMore,
  } = useNotificationsScreen();

  if (isLoading) {
    return <ScreenLoading />;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <NotificationsHeader title={t('tabs.notifications')} />
      {items.length === 0 ? (
        <NotificationsEmptyState />
      ) : (
        <NotificationsList
          items={items}
          onItemPress={onNotificationPress}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          isLoadingMore={isLoadingMore}
          onLoadMore={onLoadMore}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
});
