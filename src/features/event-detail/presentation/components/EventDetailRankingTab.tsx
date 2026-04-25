import type { RankingRow } from '../../data/eventRanking';
import { EventDetailRankingHostEmpty } from './EventDetailRankingHostEmpty';
import { EventDetailRankingListRow } from './EventDetailRankingListRow';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  rows: RankingRow[];
  isEventHost?: boolean;
};

/**
 * Ranking tab: list with top-3 medals and highlighted current-user row.
 */
export function EventDetailRankingTab({ rows, isEventHost = false }: Props) {
  const { t } = useTranslation();
  const showHostEmpty = isEventHost && rows.length === 0;
  const sectionTitle = isEventHost
    ? t('eventDetail.rankingTitleHost')
    : t('eventDetail.rankingTitleGuest');

  return (
    <View>
      <Text style={styles.sectionTitle}>{sectionTitle}</Text>
      {showHostEmpty && <EventDetailRankingHostEmpty />}
      {isEventHost && <Text style={styles.intro}>{t('eventDetail.rankingIntro')}</Text>}
      {rows.map((row) => (
        <EventDetailRankingListRow key={row.id} row={row} />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  sectionTitle: {
    color: colors.neutral.primary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
    marginBottom: 10,
  },
  intro: {
    color: colors.neutral.primary,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamilies.signikaLight,
    fontWeight: '300',
    opacity: 0.88,
    marginBottom: 20,
  },
});
