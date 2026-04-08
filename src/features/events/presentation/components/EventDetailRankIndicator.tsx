import type { RankingMedal, RankingRow } from '../data/eventRanking';
import { EventDetailPreEventRankDecor } from './EventDetailPreEventRankDecor';
import { colors } from '@/src/ui';
import { Image, StyleSheet, Text, View } from 'react-native';

const RANKING_BADGE_SCALLOP = require('../../../../../assets/images/event-detail/ranking-badge-scallop.png');

const MEDAL_SIZE = 40;

const MEDAL_TINT: Record<RankingMedal, string> = {
  gold: colors.events.rankingGold,
  silver: colors.events.rankingSilver,
  bronze: colors.events.rankingBronze,
};

export function EventDetailRankIndicator({ row }: { row: RankingRow }) {
  if (row.preEventRankSlot !== undefined) {
    return <EventDetailPreEventRankDecor slot={row.preEventRankSlot} />;
  }

  if (row.medal) {
    return (
      <View style={styles.medalBadgeWrap}>
        <Image
          source={RANKING_BADGE_SCALLOP}
          style={[styles.medalBadgeImage, { tintColor: MEDAL_TINT[row.medal] }]}
          resizeMode="contain"
          accessibilityElementsHidden
        />
        <Text style={styles.medalNumber}>{String(row.rank)}</Text>
      </View>
    );
  }

  return (
    <View style={styles.rankPlain}>
      <Text style={styles.rankPlainText}>{String(row.rank)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  rankPlain: {
    width: MEDAL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankPlainText: {
    color: colors.neutral.primary,
    fontSize: 18,
    fontWeight: '700',
  },
});
