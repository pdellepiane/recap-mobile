import {
  scaledOnboardingSize,
  useOnboardingScale,
} from '../utils/onboardingLayout';
import { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';

type DecorativeImagesProps = {
  images: ImageSourcePropType[];
};

export function DecorativeImages({ images }: DecorativeImagesProps) {
  const scale = useOnboardingScale();

  const layout = useMemo(
    () => ({
      marginRight: scaledOnboardingSize(8, scale),
      gap: scaledOnboardingSize(8, scale),
      imageSize: scaledOnboardingSize(48, scale),
    }),
    [scale],
  );

  return (
    <View
      style={[
        styles.decorativeContainer,
        { marginRight: layout.marginRight, gap: layout.gap },
      ]}
    >
      {images.map((img, i) => (
        <Image
          key={i}
          source={img}
          style={{ width: layout.imageSize, height: layout.imageSize }}
          resizeMode="contain"
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  decorativeContainer: {
    justifyContent: 'center',
  },
});
