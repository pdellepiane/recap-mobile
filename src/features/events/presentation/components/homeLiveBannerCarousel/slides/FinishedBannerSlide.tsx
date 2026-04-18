import type { HomeBannerItem } from '@/src/core/api/types';
import { colors } from '@/src/ui';
import { Image, StyleSheet, Text, View } from 'react-native';
import { CHECK_GREY_ICON } from '../assets';
import { HomeBannerCtaPill } from '../HomeBannerCtaPill';
import {
  CARD_W,
  COLLAGE_CELL,
  COLLAGE_COL_OVERLAP,
  COLLAGE_ROW_OVERLAP,
  COLLAGE_STAGGER,
  PROMO_RADIUS,
} from '../layout';
import { parseGuestImageUris } from '../parseGuestImageUris';

type Props = {
  banner: HomeBannerItem;
  width: number;
  height: number;
};

function CollageFace({ uri, size = COLLAGE_CELL }: { uri: string; size?: number }) {
  const r = size / 2;
  return (
    <View
      style={[
        styles.collageCell,
        {
          width: size,
          height: size,
          borderRadius: r,
        },
      ]}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size }} resizeMode="cover" />
      ) : null}
    </View>
  );
}

export function FinishedBannerSlide({ banner, width, height }: Props) {
  const coverFb = banner.cover?.trim() ?? '';
  const faces = parseGuestImageUris(banner.guest_images, coverFb);

  return (
    <View style={[styles.root, { width, height, borderRadius: PROMO_RADIUS }]}>
      <View style={styles.row}>
        <View style={styles.left}>
          <View style={styles.statusRow}>
            <View style={styles.checkBubble}>
              <Image source={CHECK_GREY_ICON} style={styles.checkIcon} resizeMode="contain" />
            </View>
            <Text style={styles.statusLabel}>Recuerdo</Text>
          </View>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {banner.name}
          </Text>
          <HomeBannerCtaPill
            label="VER RECUERDO"
            variant="accent"
            style={{ paddingVertical: 11, paddingHorizontal: 20 }}
          />
        </View>
        <View style={styles.rightWrap}>
          <View style={styles.rightPanel}>
            <View style={styles.collage}>
              <View style={[styles.collageCol, { marginRight: COLLAGE_COL_OVERLAP }]}>
                <CollageFace uri={faces[0] ?? ''} />
                <View style={{ marginTop: COLLAGE_ROW_OVERLAP }}>
                  <CollageFace uri={faces[2] ?? ''} />
                </View>
                <View style={{ marginTop: COLLAGE_ROW_OVERLAP }}>
                  <CollageFace uri={faces[4] ?? ''} />
                </View>
              </View>
              <View style={[styles.collageCol, { marginLeft: COLLAGE_COL_OVERLAP / 2 }]}>
                <View style={{ marginTop: COLLAGE_STAGGER }}>
                  <CollageFace uri={faces[1] ?? ''} />
                </View>
                <View style={{ marginTop: COLLAGE_ROW_OVERLAP }}>
                  <CollageFace uri={faces[3] ?? ''} />
                </View>
                <View style={{ marginTop: COLLAGE_ROW_OVERLAP }}>
                  <CollageFace uri={faces[5] ?? ''} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.background.elevated,
    overflow: 'hidden',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  left: {
    width: Math.round(CARD_W * 0.48),
    paddingLeft: 18,
    paddingRight: 10,
    paddingVertical: 20,
    justifyContent: 'center',
    gap: 14,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.overlay.white22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    width: 14,
    height: 14,
  },
  statusLabel: {
    color: colors.neutral.primary,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  title: {
    color: colors.neutral.primary,
    fontSize: 21,
    fontWeight: '800',
    lineHeight: 26,
    letterSpacing: -0.35,
  },
  rightWrap: {
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
  },
  rightPanel: {
    flex: 1,
    backgroundColor: colors.background.primary,
    marginLeft: -36,
    paddingVertical: 10,
    paddingRight: 2,
    borderTopLeftRadius: 96,
    borderBottomLeftRadius: 96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  collage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -12,
    paddingLeft: 8,
  },
  collageCol: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  collageCell: {
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.background.primary,
    backgroundColor: colors.background.elevated,
  },
});
