import { images } from '@/src/assets/images';
import { colors } from '@/src/ui';
import { Pressable, Image as RNImage, StyleSheet, View } from 'react-native';

const CONTROL_SIZE = 56;

type Props = {
  openPhotoGalleryLabel: string;
  onOpenGallery: () => void;
};

export function EventDetailCameraGalleryButton({ openPhotoGalleryLabel, onOpenGallery }: Props) {
  return (
    <View style={styles.galleryRow}>
      <Pressable
        onPress={onOpenGallery}
        hitSlop={8}
        style={({ pressed }) => [styles.controlBtn, styles.galleryBtn, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={openPhotoGalleryLabel}
      >
        <RNImage
          source={images.common.camera.gallery}
          style={styles.galleryIcon}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  galleryRow: {
    paddingTop: 20,
    paddingLeft: 20,
  },
  controlBtn: {
    width: CONTROL_SIZE,
    height: CONTROL_SIZE,
    borderRadius: CONTROL_SIZE / 2,
    backgroundColor: colors.background.primaryOpacity5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryBtn: {
    backgroundColor: colors.background.elevated,
  },
  galleryIcon: {
    width: 24,
    height: 24,
  },
  pressed: {
    opacity: 0.82,
  },
});
