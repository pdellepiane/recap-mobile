import { images } from '@/src/assets/images';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, StyleSheet, Text, View } from 'react-native';

const ILLUSTRATION_SIZE = 250;

export function HomeEmptyState() {
  return (
    <View style={styles.root}>
      <Image
        source={images.home.noEvents}
        style={styles.illustration}
        resizeMode="contain"
        accessibilityRole="image"
        accessibilityLabel="Sin eventos"
      />

      <Text style={styles.title}>No tienes ningún evento</Text>
      <Text style={styles.subtitle}>
        Empieza a crear tus eventos en nuestra página Sin Envolturas
      </Text>
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
