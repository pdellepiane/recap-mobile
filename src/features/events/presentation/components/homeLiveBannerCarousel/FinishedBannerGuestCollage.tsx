import { FINISHED_GUEST_COLLAGE_FRAME } from './layout';
import { colors } from '@/src/ui';
import type { StyleProp, ViewStyle } from 'react-native';
import { Image, StyleSheet, View } from 'react-native';

type CollageFaceProps = {
  uri: string;
  size: number;
  style?: StyleProp<ViewStyle>;
  zIndex?: number;
};

function CollageFace({ uri, size, style, zIndex }: CollageFaceProps) {
  const r = size / 2;
  return (
    <View
      style={[
        styles.collageCell,
        style,
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: r,
          zIndex,
        },
      ]}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size }} resizeMode="cover" />
      ) : null}
    </View>
  );
}

export type FinishedBannerGuestCollageProps = {
  /** Up to six guest image URLs (padded by {@link parseGuestImageUris}). */
  faceUris: string[];
};

/**
 * Pixel-placed faces for a 214×214 frame: diagonal stagger, corner crops, focal middle-right.
 * Indices:0 top-left, 1 top-right, 2 mid-left, 3 mid-right (largest), 4 bottom-left, 5 bottom-right.
 */
const FACE_PLACES: { size: number; top: number; left: number; z: number }[] = [
  { size: 72, top: -4, left: 15, z: 1 }, // left
  { size: 54, top: 10, left: 103, z: 2 }, // right
  { size: 54, top: 75, left: 24, z: 2 }, // left
  { size: 72, top: 70, left: 95, z: 5 }, // right
  { size: 72, top: 136, left: 15, z: 1 }, // left
  { size: 54, top: 155, left: 103, z: 2 }, // right
];

export function FinishedBannerGuestCollage({ faceUris }: FinishedBannerGuestCollageProps) {
  const f = (i: number) => faceUris[i] ?? '';

  return (
    <View style={styles.collage} pointerEvents="box-none">
      {FACE_PLACES.map((place, i) => (
        <CollageFace
          key={`face-${String(i)}`}
          uri={f(i)}
          size={place.size}
          zIndex={place.z}
          style={{ top: place.top, left: place.left }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  collage: {
    width: FINISHED_GUEST_COLLAGE_FRAME,
    height: FINISHED_GUEST_COLLAGE_FRAME,
    position: 'relative',
  },
  collageCell: {
    overflow: 'hidden',
    backgroundColor: colors.background.elevated,
  },
});
