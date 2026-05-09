import { images } from '@/src/assets/images';
import { Button } from '@/src/ui/Button';
import { StyleSheet, View } from 'react-native';

type Props = {
  addPhotoLabel: string;
  addPhotoText: string;
  uploadingText?: string;
  loading?: boolean;
  onAddPhoto: () => void;
};

export function EventDetailCameraPreviewFooter({
  addPhotoLabel,
  addPhotoText,
  uploadingText,
  loading = false,
  onAddPhoto,
}: Props) {
  return (
    <View style={styles.previewFooter}>
      <Button
        title={addPhotoText}
        onPress={onAddPhoto}
        loading={loading}
        loadingText={uploadingText}
        accessibilityLabel={addPhotoLabel}
        style={styles.addPhotoBtn}
        size="sm"
        rightIconSource={images.common.goToRight}
        rightIconStyle={styles.addPhotoArrowIcon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  previewFooter: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'flex-end',
  },
  addPhotoBtn: {
    minWidth: 182,
  },
  addPhotoArrowIcon: {
    width: 15,
    height: 15,
  },
});
