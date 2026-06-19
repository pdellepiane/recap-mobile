import { ProfileFooter } from '../components/ProfileFooter';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileMenuRow } from '../components/ProfileMenuRow';
import { useProfileScreen } from '../hooks/useProfileScreen';
import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { AppRefreshControl, colors, ScreenLoading } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ProfileScreenPage = () => {
  const { t } = useTranslation();
  const {
    isLoading,
    isRefreshing,
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
    handleRefresh,
  } = useProfileScreen();

  if (isLoading) {
    return <ScreenLoading />;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<AppRefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
      >
        <ProfileHeader
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

        <ProfileFooter version={version} isSigningOut={isSigningOut} onLogout={handleLogout} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingHorizontal: 20,
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
