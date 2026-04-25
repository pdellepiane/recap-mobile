import { images } from '@/src/assets/images';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image as RNImage, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  showCamera: boolean;
  eventTitle?: string;
  onClose: () => void;
  onDiscardPreview: () => void;
  closeLabel: string;
  discardLabel: string;
  fallbackTitle: string;
};

export function EventDetailCameraHeader({
  showCamera,
  eventTitle,
  onClose,
  onDiscardPreview,
  closeLabel,
  discardLabel,
  fallbackTitle,
}: Props) {
  return (
    <View style={styles.header} pointerEvents="box-none">
      <Pressable
        onPress={showCamera ? onClose : onDiscardPreview}
        hitSlop={10}
        style={({ pressed }) => [
          styles.closeBtn,
          !showCamera && styles.closeBtnFilled,
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={showCamera ? closeLabel : discardLabel}
      >
        <RNImage source={images.common.camera.close} style={styles.closeIcon} resizeMode="contain" />
      </Pressable>
      <Text style={styles.headerTitle} numberOfLines={1}>
        {eventTitle?.trim() || fallbackTitle}
      </Text>
      <View style={styles.headerSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 18,
    paddingHorizontal: 18,
  },
  closeBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnFilled: {
    borderRadius: 24,
    backgroundColor: colors.background.primary,
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
  headerTitle: {
    flex: 1,
    color: colors.neutral.primary,
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 22,
    fontFamily: fontFamilies.medium,
    marginHorizontal: 12,
  },
  headerSpacer: {
    width: 44,
    height: 44,
  },
  pressed: {
    opacity: 0.82,
  },
});
