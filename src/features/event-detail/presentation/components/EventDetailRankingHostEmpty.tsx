import type { RankingMedal } from '../../data/eventRanking';
import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors, radii } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, StyleSheet, Text, View } from 'react-native';

const MEDAL_SIZE = 40;

const MEDAL_TINT: Record<RankingMedal, string> = {
  gold: colors.events.rankingGold,
  silver: colors.events.rankingSilver,
  bronze: colors.events.rankingBronze,
};

const MEDALS: { medal: RankingMedal; rank: number }[] = [
  { medal: 'gold', rank: 1 },
  { medal: 'silver', rank: 2 },
  { medal: 'bronze', rank: 3 },
];

/**
 * Host-only empty ranking: medal preview + copy (sin filas de API).
 */
export function EventDetailRankingHostEmpty() {
  const { t } = useTranslation();
  const copy = t('eventDetail.rankingHostEmpty');

  return (
    <View style={styles.card} accessible accessibilityLabel={copy}>
      <View style={styles.medalsRow}>
        {MEDALS.map(({ medal, rank }) => (
          <View key={medal} style={styles.medalBadgeWrap}>
            <Image
              source={images.eventDetail.ranking.badgeScallop}
              style={[styles.medalBadgeImage, { tintColor: MEDAL_TINT[medal] }]}
              resizeMode="contain"
              accessibilityElementsHidden
            />
            <Text style={styles.medalNumber}>{String(rank)}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.copy}>{copy}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: radii.card,
    backgroundColor: colors.background.tertiary,
    marginBottom: 12,
  },
  medalsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  medalBadgeWrap: {
    width: MEDAL_SIZE,
    height: MEDAL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalBadgeImage: {
    position: 'absolute',
    width: MEDAL_SIZE,
    height: MEDAL_SIZE,
  },
  medalNumber: {
    position: 'relative',
    zIndex: 1,
    color: colors.neutral.primary,
    fontSize: 15,
    fontWeight: '800',
    textShadowColor: colors.overlay.black35,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    color: colors.neutral.primary,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fontFamilies.signikaLight,
    fontWeight: '300',
  },
});
