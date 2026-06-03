import { useProfile } from '../hooks/useProfile';
import { useTranslation } from '@/src/i18n';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { BackButton, colors, Form, Spinner } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text, View } from 'react-native';

export const ProfileEditNameScreenPage = () => {
  const { t } = useTranslation();
  const { goBack } = useCoordinator();
  const { profile, isLoading } = useProfile();

  const displayName = profile?.name ?? '-';

  if (isLoading) {
    return <Spinner style={styles.loader} />;
  }

  return (
    <Form>
      <View style={styles.content}>
        <BackButton onPress={goBack} style={styles.backButton} />
        <Text style={styles.title}>{t('profile.accountTitle')}</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>{t('profile.nameLabel')}</Text>
            <Text style={styles.rowValue}>{displayName}</Text>
          </View>
        </View>
      </View>
    </Form>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingTop: 10,
  },
  backButton: {
    marginLeft: -10,
  },
  title: {
    marginTop: 2,
    fontFamily: fontFamilies.semiBold,
    fontSize: 28,
    color: colors.neutral.primary,
    marginBottom: 22,
  },
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowLabel: {
    fontFamily: fontFamilies.signikaRegular,
    fontSize: 16,
    color: colors.neutral.secondary,
  },
  rowValue: {
    fontFamily: fontFamilies.signikaRegular,
    fontSize: 16,
    color: colors.neutral.primary,
  },
});
