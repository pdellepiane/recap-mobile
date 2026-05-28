import { useProfileScreen } from '../hooks/useProfileScreen';
import { useTranslation } from '@/src/i18n';
import { BackButton, colors, Form, Spinner } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { images } from '@/src/assets/images';
import Constants from 'expo-constants';
import { Image, StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import * as Linking from 'expo-linking';
import * as StoreReview from 'expo-store-review';
import { initialsFromFullName } from '@/src/ui/HostInitialsAvatar';
import { useCallback, useMemo, useState } from 'react';

type ProfileMenuView = 'menu' | 'account';

export const ProfileScreenPage = () => {
  const { t } = useTranslation();
  const { profile, isLoading, isSigningOut, handleLogout } = useProfileScreen();
  const [view, setView] = useState<ProfileMenuView>('menu');

  const displayName = profile?.name ?? '-';
  const initials = useMemo(() => initialsFromFullName(displayName), [displayName]);

  const version = useMemo(() => {
    const v = Constants.expoConfig?.version;
    if (!v) return 'unknown';
    return String(v);
  }, []);

  const handleRate = useCallback(async () => {
    if (Platform.OS === 'web') {
      return;
    }
    try {
      // Expo Store Review shows the native rating prompt.
      await StoreReview.requestReview();
    } catch {
      // Best-effort: if the prompt can't be shown, we don't block the user.
    }
  }, []);

  const handleLegal = useCallback(async () => {
    await Linking.openURL('https://sinenvolturas.com/legal/terms-and-conditions');
  }, []);

  if (isLoading) {
    return <Spinner style={styles.loader} />;
  }

  return (
    <Form>
      <View style={styles.root}>
        {view === 'menu' ? (
          <View style={styles.menuContent}>
            <View style={styles.header}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <Text style={styles.userName}>{displayName}</Text>
            </View>

            <Text style={styles.sectionTitle}>{t('profile.sectionAccount')}</Text>

            <Pressable
              onPress={() => setView('account')}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            >
              <View style={styles.rowIconWrap}>
                <View style={[styles.rowIcon, styles.rowIconSecondary]}>
                  <Image source={images.tabs.profileInactive} style={styles.rowIconImage} />
                </View>
              </View>
              <Text style={styles.rowLabel}>{t('profile.menuAccount')}</Text>
              <View style={styles.rowRight}>
                <View style={styles.caret} />
              </View>
            </Pressable>

            <Text style={[styles.sectionTitle, styles.sectionTitleOther]}>{t('profile.sectionOther')}</Text>

            <Pressable
              onPress={handleRate}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            >
              <View style={styles.rowIconWrap}>
                <View style={[styles.rowIcon, styles.rowIconSecondary]}>
                  <Text style={styles.rowIconGlyph}>★</Text>
                </View>
              </View>
              <Text style={styles.rowLabel}>{t('profile.menuRate')}</Text>
              <View style={styles.rowRight}>
                <View style={styles.caret} />
              </View>
            </Pressable>

            <Pressable
              onPress={handleLegal}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            >
              <View style={styles.rowIconWrap}>
                <View style={[styles.rowIcon, styles.rowIconSecondary]}>
                  <Text style={styles.rowIconGlyph}>✓</Text>
                </View>
              </View>
              <Text style={styles.rowLabel}>{t('profile.menuLegal')}</Text>
              <View style={styles.rowRight}>
                <View style={styles.caret} />
              </View>
            </Pressable>
          </View>
        ) : (
          <View style={styles.accountContent}>
            <BackButton onPress={() => setView('menu')} style={styles.backButton} />
            <Text style={styles.accountTitle}>{t('profile.accountTitle')}</Text>

            <View style={styles.accountCard}>
              <View style={styles.accountRow}>
                <Text style={styles.accountRowLabel}>{t('profile.nameLabel')}</Text>
                <Text style={styles.accountRowValue}>{displayName}</Text>
              </View>
            </View>
          </View>
        )}

        {view === 'menu' ? (
          <View style={styles.bottom}>
            <Text style={styles.versionText}>V.{version}</Text>
            <Pressable
              onPress={handleLogout}
              disabled={isSigningOut}
              style={({ pressed }) => [
                styles.logoutButton,
                isSigningOut && styles.logoutButtonDisabled,
                pressed && !isSigningOut && styles.logoutButtonPressed,
              ]}
            >
              <Text style={styles.logoutButtonText}>
                {isSigningOut ? t('profile.loggingOut') : t('profile.logout')}
              </Text>
            </Pressable>
          </View>
        ) : null}
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
  root: {
    flex: 1,
    justifyContent: 'space-between',
  },
  menuContent: {
    flex: 1,
    paddingTop: 12,
  },
  header: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 10,
    paddingBottom: 18,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.states.warning,
  },
  avatarText: {
    fontFamily: fontFamilies.signikaBold,
    fontSize: 30,
    fontWeight: '700',
    color: colors.background.primary,
  },
  userName: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 20,
    color: colors.neutral.primary,
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: fontFamilies.signikaRegular,
    fontSize: 16,
    lineHeight: 22,
    color: colors.neutral.secondary,
    marginTop: 10,
    marginBottom: 8,
  },
  sectionTitleOther: {
    marginTop: 22,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  rowPressed: {
    backgroundColor: colors.background.primaryOpacity5 ?? 'rgba(34,34,34,0.5)',
  },
  rowIconWrap: {
    width: 34,
    alignItems: 'center',
  },
  rowIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconSecondary: {
    backgroundColor: colors.background.elevated,
  },
  rowIconImage: {
    width: 14,
    height: 14,
    tintColor: colors.neutral.secondary,
  },
  rowIconGlyph: {
    color: colors.neutral.secondary,
    fontSize: 14,
    lineHeight: 14,
    fontFamily: fontFamilies.signikaRegular,
  },
  rowLabel: {
    flex: 1,
    fontFamily: fontFamilies.signikaRegular,
    fontSize: 18,
    color: colors.neutral.primary,
  },
  rowValue: {
    fontFamily: fontFamilies.signikaRegular,
    fontSize: 16,
    color: colors.neutral.secondary,
    marginRight: 12,
  },
  rowRight: {
    width: 26,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  caret: {
    width: 10,
    height: 10,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderRightColor: colors.neutral.secondary,
    borderBottomColor: colors.neutral.secondary,
    transform: [{ rotate: '-45deg' }],
  },
  bottom: {
    paddingBottom: 6,
  },
  versionText: {
    color: colors.neutral.tertiary,
    fontFamily: fontFamilies.signikaRegular,
    fontSize: 14,
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: colors.neutral.lightest,
    borderRadius: 12,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  logoutButtonDisabled: {
    opacity: 0.7,
  },
  logoutButtonPressed: {
    opacity: 0.88,
  },
  logoutButtonText: {
    color: colors.background.primary,
    fontFamily: fontFamilies.signikaRegular,
    fontSize: 18,
    fontWeight: '400',
  },
  backButton: {
    marginLeft: -10,
  },
  accountContent: {
    flex: 1,
    paddingTop: 10,
  },
  accountTitle: {
    marginTop: 2,
    fontFamily: fontFamilies.semiBold,
    fontSize: 28,
    color: colors.neutral.primary,
    marginBottom: 22,
  },
  accountCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 18,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  accountRowLabel: {
    fontFamily: fontFamilies.signikaRegular,
    fontSize: 16,
    color: colors.neutral.secondary,
  },
  accountRowValue: {
    fontFamily: fontFamilies.signikaRegular,
    fontSize: 16,
    color: colors.neutral.primary,
  },
});
