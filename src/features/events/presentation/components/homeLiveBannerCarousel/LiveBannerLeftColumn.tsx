import { BannerSlideCoverCircle } from './BannerSlideCoverCircle';
import {
  BANNER_STATE3_DECOR,
  BANNER_STATE3_EMOJI_HEARTS,
  BANNER_STATE3_EMOJI_PARTY,
} from './assets';
import { CARD_W } from './layout';
import { Image, StyleSheet, View } from 'react-native';

/** Room for emoji overlap beyond the avatar diameter. */
const CLUSTER_PAD = 28;

type Props = {
  coverUri: string;
  avatarDiameter: number;
};

/** Left column for {@link LiveBannerSlide}: decor, circular cover, emoji overlays. */
export function LiveBannerLeftColumn({ coverUri, avatarDiameter }: Props) {
  const clusterSize = avatarDiameter + CLUSTER_PAD;

  return (
    <>
      <Image source={BANNER_STATE3_DECOR} style={styles.leftImage} resizeMode="contain" />
      <View style={[styles.cluster, { width: clusterSize, height: clusterSize }]}>
        <BannerSlideCoverCircle diameter={avatarDiameter} uri={coverUri} variant="live" />
        <Image source={BANNER_STATE3_EMOJI_PARTY} style={styles.emojiParty} resizeMode="contain" />
        <Image
          source={BANNER_STATE3_EMOJI_HEARTS}
          style={styles.emojiHearts}
          resizeMode="contain"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  leftImage: {
    width: Math.round(CARD_W * 0.33),
    height: Math.round(CARD_W * 0.33),
    marginTop: 'auto',
  },
  cluster: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  emojiParty: {
    position: 'absolute',
    width: 56,
    height: 52,
    top: 0,
    right: -4,
    zIndex: 2,
  },
  emojiHearts: {
    position: 'absolute',
    width: 110,
    height: 110,
    top: '75%',
    left: -20,
    zIndex: 2,
  },
});
