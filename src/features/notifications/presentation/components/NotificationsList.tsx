import type { NotificationItem } from '../../data/notificationItem';
import { NotificationListItem } from './NotificationListItem';
import { AppRefreshControl, colors } from '@/src/ui';
import { FlatList, StyleSheet, View } from 'react-native';

type Props = {
  items: NotificationItem[];
  onItemPress?: (item: NotificationItem) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function NotificationsList({ items, onItemPress, refreshing = false, onRefresh }: Props) {
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
});
