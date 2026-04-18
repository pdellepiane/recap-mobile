import { Image, StyleSheet, View } from 'react-native';
import {
  BANNER_STATE3_DECOR,
  BANNER_STATE3_EMOJI_HEARTS,
  BANNER_STATE3_EMOJI_PARTY,
} from './assets';
import { BannerSlideCoverCircle } from './BannerSlideCoverCircle';
import { BANNER_STRUCTURED_FRAME_H, CARD_W } from './layout';

const LEFT_W = Math.round(CARD_W * 0.4);
/** Room for emoji overlap beyond the avatar diameter. */
const CLUSTER_PAD = 28;

type Props = {
  coverUri: string;
  avatarDiameter: number;
};

/**
 * Left column for {@link LiveBannerSlide}: pale-green blob (item-1), circular cover, party + hearts emojis (item-2, item-3).
 */
export function LiveBannerLeftArtwork({ coverUri, avatarDiameter }: Props) {
  const clusterSize = avatarDiameter + CLUSTER_PAD;

  return (
    <View style={styles.left}>
      <Image source={BANNER_STATE3_DECOR} style={styles.decor} resizeMode="contain" />
      <View style={[styles.cluster, { width: clusterSize, height: clusterSize }]}>
        <BannerSlideCoverCircle
          diameter={avatarDiameter}
          uri={coverUri}
          variant="live"
          style={styles.avatar}
        />
        <Image source={BANNER_STATE3_EMOJI_PARTY} style={styles.emojiParty} resizeMode="contain" />
        <Image source={BANNER_STATE3_EMOJI_HEARTS} style={styles.emojiHearts} resizeMode="contain" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  left: {
    width: LEFT_W,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  decor: {
    position: 'absolute',
    width: LEFT_W * 1.85,
    height: LEFT_W * 1.8,
    left: -LEFT_W * 0.52,
    bottom: -BANNER_STRUCTURED_FRAME_H * 0.12,
    opacity: 0.95,
  },
  cluster: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  avatar: {
    zIndex: 1,
  },
  emojiParty: {
    position: 'absolute',
    width: 56,
    height: 52,
    top: -2,
    right: -4,
    zIndex: 2,
  },
  emojiHearts: {
    position: 'absolute',
    width: 50,
    height: 50,
    bottom: 2,
    left: -10,
    zIndex: 2,
  },
});
