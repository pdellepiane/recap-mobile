import { useBannerLayout } from './BannerLayoutContext';
import { BannerSlideCoverCircle } from './BannerSlideCoverCircle';
import { images } from '@/src/assets/images';
import { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';

/** Room for emoji overlap beyond the avatar diameter. */
const CLUSTER_PAD = 28;

type Props = {
  coverUri: string;
  avatarDiameter: number;
};

/** Left column for {@link LiveBannerSlide}: decor, circular cover, emoji overlays. */
export function LiveBannerLeftColumn({ coverUri, avatarDiameter }: Props) {
  const { cardWidth } = useBannerLayout();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        leftImage: {
          width: Math.round(cardWidth * 0.33),
          height: Math.round(cardWidth * 0.33),
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
      }),
    [cardWidth],
  );
  const clusterSize = avatarDiameter + CLUSTER_PAD;

  return (
    <>
      <Image
        source={images.homeBanner.state3.decor}
        style={styles.leftImage}
        resizeMode="contain"
      />
      <View style={[styles.cluster, { width: clusterSize, height: clusterSize }]}>
        <BannerSlideCoverCircle diameter={avatarDiameter} uri={coverUri} variant="live" />
        <Image
          source={images.homeBanner.state3.emojiParty}
          style={styles.emojiParty}
          resizeMode="contain"
        />
        <Image
          source={images.homeBanner.state3.emojiHearts}
          style={styles.emojiHearts}
          resizeMode="contain"
        />
      </View>
    </>
  );
}
