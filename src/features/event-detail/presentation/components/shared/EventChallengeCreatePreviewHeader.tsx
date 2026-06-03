import { images } from '@/src/assets/images';
import { BackButton, colors } from '@/src/ui';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  onBack: () => void;
  onTrash: () => void;
  backAccessibilityLabel: string;
  trashAccessibilityLabel: string;
};

export function EventChallengeCreatePreviewHeader({
  onBack,
  onTrash,
  backAccessibilityLabel,
  trashAccessibilityLabel,
}: Props) {
  return (
    <SafeAreaView edges={['top']}>
      <View style={styles.headerRow}>
        <BackButton
          style={styles.backButton}
          onPress={onBack}
          accessibilityLabel={backAccessibilityLabel}
        />
        <Pressable
          onPress={onTrash}
          accessibilityRole="button"
          accessibilityLabel={trashAccessibilityLabel}
        >
          <Image
            source={images.common.remove}
            style={styles.trashIcon}
            resizeMode="contain"
            tintColor={colors.neutral.primary}
            accessibilityElementsHidden
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  backButton: {
    marginBottom: 0,
  },
  trashIcon: {
    width: 27,
    height: 27,
  },
});
