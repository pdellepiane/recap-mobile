import { colors } from '@/src/ui';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationsRoute() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.center}>
        <Text style={styles.title}>Notificaciones</Text>
        <Text style={styles.muted}>Aquí verás tus notificaciones</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.neutral.primary,
  },
  muted: {
    fontSize: 16,
    color: colors.neutral.tertiary,
    textAlign: 'center',
  },
});
