import { images } from '@/src/assets/images';
import { Image, StyleSheet, View } from 'react-native';

export const EVENT_CHALLENGE_PHOTO_CAMERA_HERO_SIZE = 180;

const HERO_W = EVENT_CHALLENGE_PHOTO_CAMERA_HERO_SIZE;
const HERO_H = EVENT_CHALLENGE_PHOTO_CAMERA_HERO_SIZE;

export function EventChallengePhotoCameraHero() {
  return (
    <View
      style={styles.wrap}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Image
        source={images.eventDetail.challenges.photoCameraHero}
        style={styles.image}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: HERO_W,
    height: HERO_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: HERO_W,
    height: HERO_H,
  },
});
