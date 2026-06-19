import { Spinner } from '@/src/ui';
import { StyleSheet, View } from 'react-native';

type Props = {
  isLoadingMore: boolean;
};

export function NotificationsListFooter({ isLoadingMore }: Props) {
  if (!isLoadingMore) {
    return null;
  }

  return (
    <View style={styles.loadingMore}>
      <Spinner />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingMore: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
