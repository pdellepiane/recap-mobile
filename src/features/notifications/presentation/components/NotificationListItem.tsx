import { NOTIFICATION_LIST_HORIZONTAL_PADDING } from '../../data/notificationNavigation';
import { notificationInitialsName, type NotificationItem } from '../../data/notificationItem';
import { NotificationListItemLeading } from './NotificationListItemLeading';
import { NotificationListItemMessage } from './NotificationListItemMessage';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  item: NotificationItem;
  onPress?: (item: NotificationItem) => void;
};

export function NotificationListItem({ item, onPress }: Props) {
  const isUnread = !item.isSeen;

  return (
    <Pressable
      onPress={() => onPress?.(item)}
      style={({ pressed }) => [
        styles.row,
        isUnread ? styles.rowUnread : styles.rowSeen,
        pressed && styles.rowPressed,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: isUnread }}
    >
      <NotificationListItemLeading
        initialsName={notificationInitialsName(item)}
        leading={item.leading}
        isUnread={isUnread}
      />
      <View style={styles.content}>
        <NotificationListItemMessage message={item.message} />
        <Text style={styles.meta}>
          {item.timeAgo} • {item.eventName}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: NOTIFICATION_LIST_HORIZONTAL_PADDING,
  },
  rowSeen: {
    backgroundColor: colors.background.secondary,
  },
  rowUnread: {
    backgroundColor: colors.background.primary,
  },
  rowPressed: {
    opacity: 0.88,
  },
  content: {
    flex: 1,
    paddingTop: 2,
  },
  meta: {
    color: colors.typography.subColor,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontFamilies.signikaLight,
    fontWeight: '300',
  },
});
