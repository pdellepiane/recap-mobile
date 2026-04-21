import { colors } from '@/src/ui';
import { StyleSheet, View } from 'react-native';

/** Fills a circular clip when a banner cover URL is missing. */
export function BannerCoverCirclePlaceholder() {
  return <View style={styles.root} />;
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.background.elevated,
  },
});
