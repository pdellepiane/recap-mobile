import { ScreenTitle } from '@/src/ui';
import { StyleSheet, View } from 'react-native';

type Props = {
  greeting: string;
};

export function HomeHeader({ greeting }: Props) {
  return (
    <View style={styles.header}>
      <ScreenTitle>{greeting}</ScreenTitle>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
  },
});
