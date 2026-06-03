import type { RankingRow } from '../../../data/eventRanking';
import { EventDetailRankIndicator } from './EventDetailRankIndicator';
import { EventDetailRankingAvatar } from './EventDetailRankingAvatar';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  row: RankingRow;
};

export function EventDetailRankingListRow({ row }: Props) {
  return (
    <View
      style={styles.row}
      accessibilityLabel={`Puesto ${String(row.rank)}, ${row.name}, ${String(row.points)} puntos`}
    >
      <View style={styles.rankCol}>
        <EventDetailRankIndicator row={row} />
      </View>
      <EventDetailRankingAvatar row={row} />
      <Text style={styles.name} numberOfLines={1}>
        {row.name}
      </Text>
      <Text style={styles.points}>{`${String(row.points)} ptos`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 14,
    gap: 12,
  },
  rankCol: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    flex: 1,
    minWidth: 0,
    color: colors.neutral.primary,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
    fontWeight: '400',
  },
  points: {
    color: colors.states.active,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    fontFamily: fontFamilies.signikaRegular,
  },
});
