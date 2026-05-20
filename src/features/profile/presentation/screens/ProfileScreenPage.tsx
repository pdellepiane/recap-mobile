import { useProfileScreen } from '../hooks/useProfileScreen';
import { useTranslation } from '@/src/i18n';
import { Button, colors, Form, Spinner } from '@/src/ui';
import { StyleSheet, Text } from 'react-native';

export const ProfileScreenPage = () => {
  const { t } = useTranslation();
  const { profile, isLoading, isSigningOut, handleLogout } = useProfileScreen();

  if (isLoading) {
    return <Spinner style={styles.loader} />;
  }

  return (
    <Form title={t('profile.title')}>
      <Text style={styles.field}>
        {t('profile.name')}: {profile?.name ?? '-'}
      </Text>
      <Text style={styles.field}>
        {t('profile.email')}: {profile?.email ?? '-'}
      </Text>
      {profile?.fullPhone ? (
        <Text style={styles.field}>
          {t('profile.phone')}: {profile.fullPhone}
        </Text>
      ) : null}
      {profile?.languageName ? (
        <Text style={styles.field}>
          {t('profile.language')}: {profile.languageName}
        </Text>
      ) : null}
      <Button
        title={t('profile.logout')}
        onPress={handleLogout}
        loading={isSigningOut}
        loadingText={t('profile.loggingOut')}
        style={styles.logoutButton}
      />
    </Form>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
    color: colors.neutral.primary,
  },
  field: {
    fontSize: 16,
    color: colors.neutral.primary,
  },
  logoutButton: {
    marginTop: 30,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
