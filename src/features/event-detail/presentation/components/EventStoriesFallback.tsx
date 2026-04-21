import { colors } from '@/src/ui';
import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';

type EventStoriesFallbackProps = {
  topInset: number;
  onBack: () => void;
};

export function EventStoriesFallback({ topInset, onBack }: EventStoriesFallbackProps) {
  return (
    <View style={[styles.fallback, { paddingTop: topInset + 24 }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <Text style={styles.fallbackText}>No hay estados para este evento.</Text>
      <Pressable onPress={onBack} style={styles.fallbackBtn} accessibilityRole="button">
        <Text style={styles.fallbackBtnText}>Volver</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    color: colors.neutral.secondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  fallbackBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral.disabled,
  },
  fallbackBtnText: {
    color: colors.neutral.primary,
    fontWeight: '600',
  },
});
