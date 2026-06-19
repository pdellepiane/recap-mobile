import type { NotificationItem } from '../../data/notificationItem';
import { NotificationListItem } from './NotificationListItem';
import { NotificationsListFooter } from './NotificationsListFooter';
import { AppRefreshControl, colors } from '@/src/ui';
import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

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
  return (
    <Animated.View entering={FadeIn.duration(260).delay(80)} style={styles.list}>
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
        ListFooterComponent={<NotificationsListFooter isLoadingMore={isLoadingMore} />}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  separator: {
    height: 1,
    backgroundColor: colors.background.tertiary,
  },
});
