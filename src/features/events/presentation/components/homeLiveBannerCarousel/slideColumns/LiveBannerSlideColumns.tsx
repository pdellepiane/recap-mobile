import { HomeBannerCtaPill } from '../HomeBannerCtaPill';
import { LiveBannerStructuredStatusRow } from '../LiveBannerStructuredStatusRow';
import { GO_TO_RIGHT_ICON } from '../assets';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text, View } from 'react-native';

type RightProps = {
  eventName: string;
};

export function LiveBannerRightColumn({ eventName }: RightProps) {
  return (
    <View style={styles.right}>
      <LiveBannerStructuredStatusRow />
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {eventName}
      </Text>
      <HomeBannerCtaPill
        label="INGRESAR"
        trailingIcon={GO_TO_RIGHT_ICON}
        style={styles.ctaSpacing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  right: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  title: {
    color: colors.neutral.lightest,
    fontFamily: fontFamilies.signikaRegular,
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
  },
  ctaSpacing: {
    marginTop: 10,
  },
});
