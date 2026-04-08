import { colors } from '@/src/ui';
import { StyleSheet, Text, View } from 'react-native';
import type { RankingRow } from '../data/eventRanking';
import { EventDetailRankIndicator } from './EventDetailRankIndicator';
import { EventDetailRankingAvatar } from './EventDetailRankingAvatar';

const INTRO = 'Resuelve la mayor cantidad de challenges para subir en el ranking de invitados';
const INTRO_PRE_EVENT =
  'El evento aún no ha comenzado: todos parten con 0 puntos. Cuando arranque, aquí verás el ranking por challenges.';

type Props = {
  rows: RankingRow[];
};

/**
 * Ranking tab: intro + list with top-3 medals and highlighted current-user row.
 */
export function EventDetailRankingTab({ rows }: Props) {
  const isPreEvent = rows[0]?.preEventRankSlot !== undefined;

  return (
    <View>
      <Text style={styles.sectionTitle}>Ranking del evento</Text>
      <Text style={styles.intro}>{isPreEvent ? INTRO_PRE_EVENT : INTRO}</Text>

      {rows.length === 0 ? (
        <Text style={styles.empty}>Todavía no hay posiciones en el ranking.</Text>
      ) : null}

      {rows.map((row) => (
        <View
          key={row.id}
          style={[styles.row, row.isCurrentUser && styles.rowHighlight]}
          accessibilityLabel={
            isPreEvent
              ? `${row.name}, 0 puntos`
              : `Puesto ${String(row.rank)}, ${row.name}, ${String(row.points)} puntos`
          }
        >
          <View style={styles.rankCol}>
            <EventDetailRankIndicator row={row} />
          </View>
          <EventDetailRankingAvatar row={row} />
          <Text style={styles.name} numberOfLines={1}>
            {row.name}
          </Text>
          <Text style={styles.points}>
            {isPreEvent ? '0 puntos' : `${String(row.points)} ptos`}
          </Text>
        </View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  sectionTitle: {
    color: colors.neutral.primary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  intro: {
    color: colors.neutral.primary,
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.88,
    marginBottom: 20,
  },
  empty: {
    color: colors.neutral.secondary,
    fontSize: 15,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 14,
    gap: 12,
  },
  rowHighlight: {
    backgroundColor: colors.events.rankingRowHighlight,
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
    fontWeight: '600',
  },
  points: {
    color: colors.states.active,
    fontSize: 15,
    fontWeight: '700',
  },
});
