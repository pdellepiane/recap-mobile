import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors, radii } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, StyleSheet, Text, View } from 'react-native';

/**
 * Host-only empty state: icon + “0 Retos” / “No tienes retos creados”.
 */
export function EventDetailChallengesHostEmpty() {
  const { t } = useTranslation();
  return (
    <View style={styles.row} accessibilityLabel={t('eventDetail.hostEmptyA11y')}>
      <View style={styles.iconWrap}>
        <Image
          source={images.eventDetail.challenges.sadFaceIcon}
          style={styles.icon}
          resizeMode="contain"
          accessibilityElementsHidden
        />
      </View>
      <View style={styles.textCol}>
        <Text style={styles.count}>{t('eventDetail.hostEmptyCount')}</Text>
        <Text style={styles.sub}>{t('eventDetail.hostEmptySub')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 4,
    marginBottom: 12,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radii.card,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 32,
    height: 32,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  count: {
    color: colors.neutral.primary,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    fontFamily: fontFamilies.signikaSemiBold,
    marginBottom: 2,
  },
  sub: {
    color: colors.neutral.secondary,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamilies.signikaLight,
    fontWeight: '300',
  },
});
