import { useBannerCardRootStyle } from '../useBannerCardRootStyle';
import { NoBannerLeftColumn, NoBannerRightColumn } from '../slideColumns/NoBannerSlideColumns';
import { View } from 'react-native';

export function NoBannerSlide() {
  const styles = useBannerCardRootStyle();

  return (
    <View style={styles.root}>
      <View style={styles.row}>
        <NoBannerLeftColumn />
        <NoBannerRightColumn />
      </View>
    </View>
  );
}
