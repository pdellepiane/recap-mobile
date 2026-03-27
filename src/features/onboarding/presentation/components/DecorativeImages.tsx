import { Image, StyleSheet, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';

type DecorativeImagesProps = {
  images: ImageSourcePropType[];
};

export function DecorativeImages({ images }: DecorativeImagesProps) {
  return (
    <View style={styles.decorativeContainer}>
      {images.map((img, i) => (
        <Image key={i} source={img} style={styles.decorativeImage} resizeMode="contain" />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  decorativeContainer: {
    marginRight: 8,
    gap: 8,
    justifyContent: 'center',
  },
  decorativeImage: {
    width: 48,
    height: 48,
  },
});
