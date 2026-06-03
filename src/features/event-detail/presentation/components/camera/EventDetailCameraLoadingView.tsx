import { colors } from '@/src/ui';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export function EventDetailCameraLoadingView() {
  return (
    <View style={styles.root}>
      <ActivityIndicator color={colors.neutral.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
});
