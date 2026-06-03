import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, StyleSheet, Text, View } from 'react-native';

const ILLUSTRATION_SIZE = 260;

export function NotificationsEmptyState() {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <Image
        source={images.notifications.empty}
        style={styles.illustration}
        resizeMode="contain"
        accessibilityRole="image"
        accessibilityLabel={t('notifications.emptyA11y')}
      />
      <Text style={styles.message}>{t('notifications.emptyMessage')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  illustration: {
    width: ILLUSTRATION_SIZE,
    height: ILLUSTRATION_SIZE,
  },
  message: {
    color: colors.primary.lighttest,
    fontSize: 20,
    lineHeight: 28,
    fontFamily: fontFamilies.signikaRegular,
    fontWeight: '400',
    textAlign: 'center',
  },
});
