import { ProfileMenuFooter } from '../components/ProfileMenuFooter';
import { ProfileMenuHeader } from '../components/ProfileMenuHeader';
import { ProfileMenuRow } from '../components/ProfileMenuRow';
import { useProfileScreen } from '../hooks/useProfileScreen';
import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors, Form, Spinner } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { ScrollView, StyleSheet, Text } from 'react-native';

export const ProfileScreenPage = () => {
  const { t } = useTranslation();
  const {
    isLoading,
    isSigningOut,
    displayName,
    initials,
    avatarUrl,
    isUploadingAvatar,
    handleChangeAvatar,
    version,
    handleLogout,
    handleAccountPress,
    handleRate,
    handleLegal,
  } = useProfileScreen();

  if (isLoading) {
    return <Spinner style={styles.loader} />;
  }

  return (
    <Form>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <ProfileMenuHeader
          displayName={displayName}
          initials={initials}
          avatarUrl={avatarUrl}
          isUploadingAvatar={isUploadingAvatar}
          onChangeAvatar={handleChangeAvatar}
        />

        <Text style={styles.sectionTitle}>{t('profile.sectionAccount')}</Text>

        <ProfileMenuRow
          label={t('profile.menuAccount')}
          iconSource={images.profile.username}
          onPress={handleAccountPress}
        />

        <Text style={styles.sectionTitle}>{t('profile.sectionOther')}</Text>

        <ProfileMenuRow
          label={t('profile.menuRate')}
          iconSource={images.profile.rateApp}
          onPress={handleRate}
        />

        <ProfileMenuRow
          label={t('profile.menuLegal')}
          iconSource={images.profile.termsConditions}
          onPress={handleLegal}
        />

        <ProfileMenuFooter version={version} isSigningOut={isSigningOut} onLogout={handleLogout} />
      </ScrollView>
    </Form>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontFamily: fontFamilies.signikaSemiBold,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: colors.neutral.secondary,
    marginTop: 10,
  },
  contentContainer: {
    paddingBottom: 30,
  },
});
