import { colors } from '@/src/ui';
import { Button } from '@/src/ui/Button';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text, View } from 'react-native';
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
        <Button title={allowText} onPress={onAllow} size="sm" variant="active" />
        <Button title={backText} onPress={onBack} variant="ghost" size="sm" />
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
    gap: 20,
  },
  permissionText: {
    fontFamily: fontFamilies.medium,
    color: colors.neutral.primary,
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 24,
  },
});
