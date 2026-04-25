import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  bodyText: string;
  allowText: string;
  backText: string;
  onAllow: () => void;
  onBack: () => void;
};

export function EventDetailCameraPermissionView({
  bodyText,
  allowText,
  backText,
  onAllow,
  onBack,
}: Props) {
  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.permissionBody}>
        <Text style={styles.permissionText}>{bodyText}</Text>
        <Pressable onPress={onAllow} style={styles.permissionBtn}>
          <Text style={styles.permissionBtnLabel}>{allowText}</Text>
        </Pressable>
        <Pressable onPress={onBack} style={styles.permissionSecondary}>
          <Text style={styles.permissionSecondaryLabel}>{backText}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  permissionBody: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 16,
  },
  permissionText: {
    color: colors.neutral.primary,
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 24,
  },
  permissionBtn: {
    backgroundColor: colors.states.active,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  permissionBtnLabel: {
    color: colors.background.primary,
    fontSize: 17,
    fontFamily: fontFamilies.bold,
  },
  permissionSecondary: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  permissionSecondaryLabel: {
    color: colors.neutral.tertiary,
    fontSize: 16,
    fontFamily: fontFamilies.medium,
  },
});
