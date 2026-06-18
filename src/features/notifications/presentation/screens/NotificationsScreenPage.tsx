import { NotificationsEmptyState } from '../components/NotificationsEmptyState';
import { NotificationsList } from '../components/NotificationsList';
import { useNotificationsScreen } from '../hooks/useNotificationsScreen';
import { useTranslation } from '@/src/i18n';
import { colors, ScreenLoading, ScreenTitle } from '@/src/ui';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function NotificationsScreenPage() {
  const { t } = useTranslation();
  const { items, isLoading, isRefreshing, isLoadingMore, onNotificationPress, onRefresh, onLoadMore } =
    useNotificationsScreen();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <ScreenTitle>{t('tabs.notifications')}</ScreenTitle>
      </View>
      {isLoading ? (
        <ScreenLoading />
      ) : items.length === 0 ? (
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});
