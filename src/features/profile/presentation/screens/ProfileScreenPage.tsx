import { Button, colors, Form, Spinner } from '@/src/ui';
import { StyleSheet, Text } from 'react-native';
import { useProfileScreen } from '../hooks/useProfileScreen';

export const ProfileScreenPage = () => {
  const { profile, isLoading, isSigningOut, handleLogout } = useProfileScreen();

  if (isLoading) {
    return <Spinner style={styles.loader} />;
  }

  return (
    <Form title="My Profile">
      <Text style={styles.field}>Name: {profile?.name ?? '-'}</Text>
      <Text style={styles.field}>Email: {profile?.email ?? '-'}</Text>
      <Button
        title="Cerrar sesión"
        onPress={handleLogout}
        loading={isSigningOut}
        loadingText="Cerrando…"
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
