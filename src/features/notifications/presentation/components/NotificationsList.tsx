import type { NotificationItem } from '../../data/notificationItem';
import { NotificationListItem } from './NotificationListItem';
import { AppRefreshControl, colors, Spinner } from '@/src/ui';
import { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

type Props = {
  items: NotificationItem[];
  onItemPress?: (item: NotificationItem) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
};

export function NotificationsList({
  items,
  onItemPress,
  refreshing = false,
  onRefresh,
  isLoadingMore = false,
  onLoadMore,
}: Props) {
  const renderFooter = useCallback(() => {
    if (!isLoadingMore) {
      return null;
    }
    return (
      <View style={styles.loadingMore}>
        <Spinner color={colors.states.active} />
      </View>
    );
  }, [isLoadingMore]);

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <NotificationListItem item={item} onPress={onItemPress} />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <AppRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.35}
      ListFooterComponent={renderFooter}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
  separator: {
    height: 1,
    backgroundColor: colors.background.tertiary,
  },
  loadingMore: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
