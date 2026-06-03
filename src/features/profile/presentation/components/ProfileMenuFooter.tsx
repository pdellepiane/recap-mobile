import { useTranslation } from '@/src/i18n';
import { Button, colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text, View } from 'react-native';

type ProfileMenuFooterProps = {
  version: string;
  isSigningOut: boolean;
  onLogout: () => void;
};

export function ProfileMenuFooter({ version, isSigningOut, onLogout }: ProfileMenuFooterProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <Text style={styles.versionText}>V.{version}</Text>
      <Button
        title={t('profile.logout')}
        loadingText={t('profile.loggingOut')}
        loading={isSigningOut}
        variant="secondary"
        onPress={onLogout}
        style={styles.logoutButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
  },
  versionText: {
    color: colors.neutral.lightest,
    fontFamily: fontFamilies.signikaRegular,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    marginTop: 30,
    fontWeight: '400',
  },
  logoutButton: {
    paddingHorizontal: 16,
  },
});
