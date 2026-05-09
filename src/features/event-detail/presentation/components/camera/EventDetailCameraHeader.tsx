import { CloseButton, colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text, View } from 'react-native';

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
      <CloseButton
        onPress={showCamera ? onClose : onDiscardPreview}
        hitSlop={10}
        style={[styles.closeBtn, !showCamera && styles.closeBtnFilled]}
        iconStyle={styles.closeIcon}
        accessibilityLabel={showCamera ? closeLabel : discardLabel}
      />
      <Text style={styles.headerTitle} numberOfLines={2}>
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
    backgroundColor: colors.transparent.white,
  },
  closeBtnFilled: {
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
    fontWeight: '400',
    fontSize: 20,
    lineHeight: 28,
    fontFamily: fontFamilies.signikaRegular,
  },
  headerSpacer: {
    width: 44,
    height: 44,
  },
});
