import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, StyleSheet, Text, View } from 'react-native';

const ILLUSTRATION_SIZE = 250;

export function HomeEmptyState() {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <Image
        source={images.home.noEvents}
        style={styles.illustration}
        resizeMode="contain"
        accessibilityRole="image"
        accessibilityLabel={t('home.emptyA11y')}
      />

      <Text style={styles.title}>{t('home.emptyTitle')}</Text>
      <Text style={styles.subtitle}>{t('home.emptySubtitle')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  illustration: {
    width: ILLUSTRATION_SIZE,
    height: ILLUSTRATION_SIZE,
  },
  title: {
    color: colors.primary.lighttest,
    fontSize: 20,
    fontFamily: fontFamilies.signikaRegular,
    fontWeight: '400',
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: colors.typography.subColor,
    fontSize: 16,
    fontFamily: fontFamilies.signikaLight,
    fontWeight: '300',
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 320,
  },
});
