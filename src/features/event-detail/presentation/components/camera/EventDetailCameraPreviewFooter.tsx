import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  addPhotoLabel: string;
  addPhotoText: string;
  onAddPhoto: () => void;
};

export function EventDetailCameraPreviewFooter({ addPhotoLabel, addPhotoText, onAddPhoto }: Props) {
  return (
    <View style={styles.previewFooter}>
      <Pressable
        onPress={onAddPhoto}
        style={({ pressed }) => [styles.addPhotoBtn, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={addPhotoLabel}
      >
        <Text style={styles.addPhotoText}>{addPhotoText}</Text>
        <Text style={styles.addPhotoArrow}>{'\u2192'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  previewFooter: {
    paddingHorizontal: 12,
    paddingTop: 18,
    paddingBottom: 20,
    alignItems: 'flex-end',
  },
  addPhotoBtn: {
    minWidth: 182,
    borderRadius: 22,
    backgroundColor: colors.accent[500],
    paddingVertical: 15,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  addPhotoText: {
    color: colors.neutral.onLime,
    fontSize: 17,
    lineHeight: 22,
    fontFamily: fontFamilies.bold,
  },
  addPhotoArrow: {
    color: colors.neutral.onLime,
    fontSize: 24,
    lineHeight: 24,
    marginTop: -1,
  },
  pressed: {
    opacity: 0.82,
  },
});
