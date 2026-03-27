import { useProfileScreen } from '../hooks/useProfileScreen';
import { BackButton, Button, Spinner } from '@/src/ui';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  /** When false (e.g. perfil como tab en Home), no mostrar botón atrás. */
  showBackButton?: boolean;
};

export const ProfileScreenPage = ({ showBackButton = true }: Props) => {
  const { profile, isLoading, isSigningOut, handleLogout } = useProfileScreen();

  if (isLoading) {
    return <Spinner style={styles.loader} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {showBackButton ? <BackButton /> : null}
      <Text style={styles.title}>My Profile</Text>
      <Text style={styles.field}>Name: {profile?.name ?? '-'}</Text>
      <Text style={styles.field}>Email: {profile?.email ?? '-'}</Text>
      <Button
        title="Cerrar sesión"
        onPress={handleLogout}
        loading={isSigningOut}
        loadingText="Cerrando…"
        style={styles.logoutButton}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
  },
  field: {
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 24,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
