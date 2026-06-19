import { ScreenTitle } from '@/src/ui';
import { StyleSheet, View } from 'react-native';

type Props = {
  title: string;
};

export function NotificationsHeader({ title }: Props) {
  return (
    <View style={styles.header}>
      <ScreenTitle>{title}</ScreenTitle>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
  },
});
