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
  style?: StyleProp<ViewStyle>;
};

export function HomeBannerCtaPill({ label, trailingIcon, style }: HomeBannerCtaPillProps) {
  return (
    <View style={[styles.base, style]}>
      <Text style={styles.label}>{label}</Text>
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
  label: {
    color: colors.background.primary,
    fontFamily: fontFamilies.signikaMedium,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  icon: {
    width: 16,
    height: 16,
  },
});
