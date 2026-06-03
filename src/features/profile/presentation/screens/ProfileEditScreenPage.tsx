import { useProfileEditScreen } from '../hooks/useProfileEditScreen';
import { useTranslation } from '@/src/i18n';
import { BackButton, Button, colors, Form, InputField, Spinner } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { StyleSheet, Text, View } from 'react-native';

export const ProfileEditScreenPage = () => {
  const { t } = useTranslation();
  const { goBack } = useCoordinator();
  const {
    isLoading,
    firstName,
    lastName,
    setFirstName,
    setLastName,
    isSaving,
    canSave,
    handleSave,
  } = useProfileEditScreen();

  if (isLoading) {
    return <Spinner style={styles.loader} />;
  }

  return (
    <Form>
      <View style={styles.content}>
        <BackButton onPress={goBack} style={styles.backButton} />
        <Text style={styles.title}>{t('profile.accountTitle')}</Text>

        <InputField
          value={firstName}
          onChangeText={setFirstName}
          placeholder={t('profile.firstNamePlaceholder')}
          autoCapitalize="words"
        />
        <InputField
          value={lastName}
          onChangeText={setLastName}
          placeholder={t('profile.lastNamePlaceholder')}
          autoCapitalize="words"
        />

        <Button
          title={t('profile.save')}
          loadingText={t('profile.saving')}
          loading={isSaving}
          disabled={!canSave}
          onPress={() => {
            void handleSave();
          }}
          style={styles.saveButton}
        />
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
  saveButton: {
    marginTop: 8,
  },
});
