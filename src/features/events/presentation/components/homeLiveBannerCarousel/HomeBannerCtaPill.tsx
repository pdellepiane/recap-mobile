import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

export type HomeBannerCtaPillProps = {
  label: string;
  /** Right chevron; omit for text-only pills (e.g. “Ver recuerdo”). */
  trailingIcon?: ImageSourcePropType;
  /** Larger lime pill used on the structured live banner slide. */
  appearance?: 'default' | 'liveBanner';
  style?: StyleProp<ViewStyle>;
};

export function HomeBannerCtaPill({
  label,
  trailingIcon,
  appearance = 'default',
  style,
}: HomeBannerCtaPillProps) {
  const isLiveBanner = appearance === 'liveBanner';

  return (
    <View style={[isLiveBanner ? styles.liveBanner : styles.base, style]}>
      <Text style={[styles.label, isLiveBanner && styles.liveBannerLabel]}>{label}</Text>
      {trailingIcon ? (
        <Image source={trailingIcon} style={styles.icon} resizeMode="contain" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    height: 32,
    width: 108,
    gap: 8,
    backgroundColor: colors.accent[500],
  },
  liveBanner: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 6,
    backgroundColor: colors.events.homeBannerLiveLime,
  },
  label: {
    color: colors.background.primary,
    fontFamily: fontFamilies.signikaMedium,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  liveBannerLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    letterSpacing: 0.65,
    color: colors.neutral.onLime,
  },
  icon: {
    width: 16,
    height: 16,
  },
});
