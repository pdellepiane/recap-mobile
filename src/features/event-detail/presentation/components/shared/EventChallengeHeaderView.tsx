import { scaledChallengeSize, useChallengeFlowScale } from '../../utils/challengeFlowLayout';
import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { BackButton, colors } from '@/src/ui';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

/** {@link BackButton} circle size in challenge flow headers. */
export const CHALLENGE_FLOW_BACK_BUTTON_SIZE = 50;

const CHALLENGE_HEADER_PADDING_V = 20;

/** Y coordinate of the bottom edge of the challenge header row. */
export function challengeFlowBackHeaderBottom(insetTop: number): number {
  return (
    insetTop +
    CHALLENGE_HEADER_PADDING_V +
    CHALLENGE_FLOW_BACK_BUTTON_SIZE +
    CHALLENGE_HEADER_PADDING_V
  );
}

/** Scaled header height for scroll padding under a floating {@link EventChallengeHeaderView}. */
export function useChallengeFlowHeaderBottom(): number {
  const insets = useSafeAreaInsets();
  const scale = useChallengeFlowScale();
  const paddingV = scaledChallengeSize(CHALLENGE_HEADER_PADDING_V, scale);
  return insets.top + paddingV + CHALLENGE_FLOW_BACK_BUTTON_SIZE + paddingV;
}

/**
 * Scroll top inset when the header floats over content.
 * Modal routes already sit below the status bar, so exclude `insets.top` there.
 */
export function useChallengeFlowOverlayScrollPaddingTop(modalPresentation = false): number {
  const headerBottom = useChallengeFlowHeaderBottom();
  if (!modalPresentation) {
    return headerBottom;
  }
  const insets = useSafeAreaInsets();
  return Math.max(0, headerBottom - insets.top);
}

type Props = {
  onTrash?: () => void;
  /** Pin back/trash above scroll content so card art is not clipped when scrolling. */
  overlay?: boolean;
};

export function EventChallengeHeaderView({ onTrash, overlay = false }: Props) {
  const { t } = useTranslation();
  const scale = useChallengeFlowScale();
  const headerPaddingVertical = scaledChallengeSize(CHALLENGE_HEADER_PADDING_V, scale);

  const headerRow = (
    <View style={[styles.headerRow, { paddingVertical: headerPaddingVertical }]}>
      <BackButton style={styles.backButton} accessibilityLabel={t('common.back')} />
      {onTrash ? (
        <Pressable
          onPress={onTrash}
          accessibilityRole="button"
          accessibilityLabel={t('eventDetail.createQuizDeleteQuestionA11y')}
        >
          <Image
            source={images.common.remove}
            style={styles.trashIcon}
            resizeMode="contain"
            tintColor={colors.neutral.primary}
            accessibilityElementsHidden
          />
        </Pressable>
      ) : (
        <View style={styles.trashPlaceholder} />
      )}
    </View>
  );

  if (overlay) {
    return (
      <View style={styles.overlayHost} pointerEvents="box-none">
        <SafeAreaView edges={['top']} pointerEvents="box-none">
          {headerRow}
        </SafeAreaView>
      </View>
    );
  }

  return <SafeAreaView edges={['top']}>{headerRow}</SafeAreaView>;
}

const styles = StyleSheet.create({
  overlayHost: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    zIndex: 10,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    marginBottom: 0,
  },
  trashIcon: {
    width: 27,
    height: 27,
  },
  trashPlaceholder: {
    width: 27,
    height: 27,
  },
});
