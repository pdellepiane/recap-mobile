import { colors } from '@/src/ui';
import { ActivityIndicator, Image, Platform, StyleSheet, Text, View } from 'react-native';

type Props = {
  photoUri: string;
  uploadingLabel: string;
};

export function EventDetailCameraUploadOverlay({ photoUri, uploadingLabel }: Props) {
  return (
    <>
      <Image
        source={{ uri: photoUri }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        blurRadius={Platform.OS === 'android' ? 18 : 35}
        accessibilityIgnoresInvertColors
      />
      <View style={styles.scrim} />
      <View style={styles.center} pointerEvents="none">
        <ActivityIndicator size="large" color={colors.states.active} />
        <Text style={styles.label}>{uploadingLabel}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay.black35,
    zIndex: 3,
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
    gap: 14,
  },
  label: {
    color: colors.neutral.primary,
    fontSize: 17,
    fontWeight: '600',
  },
});
