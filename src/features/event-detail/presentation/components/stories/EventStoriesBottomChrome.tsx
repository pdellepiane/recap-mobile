import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { Image } from 'expo-image';
import { Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

/** Content height of the solid black footer (excluding safe-area inset). */
export const EVENT_STORIES_BOTTOM_CHROME_HEIGHT = 88;

type Props = {
  chromeStyle: object;
  bottomInset: number;
  vote: 'like' | 'dislike' | null | undefined;
  onVote: (value: 'like' | 'dislike') => void;
};

export function EventStoriesBottomChrome({ chromeStyle, bottomInset, vote, onVote }: Props) {
  const { t } = useTranslation();
  const heartTint = vote === 'like' ? colors.states.error : colors.neutral.primary;

  return (
    <Animated.View
      style={[
        styles.root,
        chromeStyle,
        {
          paddingBottom: bottomInset,
          minHeight: EVENT_STORIES_BOTTOM_CHROME_HEIGHT + bottomInset,
        },
      ]}
      pointerEvents="box-none"
    >
      <Pressable
        onPress={() => onVote('like')}
        style={styles.likeBtn}
        accessibilityRole="button"
        accessibilityLabel={t('stories.like')}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Image
          source={images.common.heart}
          style={styles.heartIcon}
          contentFit="contain"
          tintColor={heartTint}
          accessibilityElementsHidden
        />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    zIndex: 4,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  likeBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    width: 32,
    height: 32,
  },
});
