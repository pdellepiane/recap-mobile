import type { RankingRow } from '../../../data/eventRanking';
import { EventDetailRankingHostEmpty } from './EventDetailRankingHostEmpty';
import { EventDetailRankingListRow } from './EventDetailRankingListRow';
import { EventType } from '@/src/core/api';
import { getEventType } from '@/src/features/home/presentation/utils/eventDisplay';
import { useTranslation } from '@/src/i18n';
import { colors, Spinner } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  rows: RankingRow[];
  isRankingLoaded?: boolean;
  eventDateIso?: string;
  isOrganizer?: boolean;
};

/**
 * Ranking tab: list with top-3 medals and highlighted current-user row.
 */
export const EventDetailRankingTab = memo(function EventDetailRankingTab({
  rows,
  isRankingLoaded = false,
  eventDateIso,
  isOrganizer = false,
}: Props) {
  const { t } = useTranslation();
  const eventType = useMemo(() => getEventType(eventDateIso), [eventDateIso]);
  const isEventWithoutDateOrBeforeStart = useMemo(
    () => eventType === EventType.EventToStart || eventType === EventType.EventWithoutDate,
    [eventType],
  );
  const sectionTitleKey = useMemo((): string | null => {
    if (isEventWithoutDateOrBeforeStart) {
      return isOrganizer ? 'eventDetail.rankingTitleHost' : null;
    }
    return 'eventDetail.rankingTitleGuest';
  }, [isEventWithoutDateOrBeforeStart, isOrganizer]);
  const introText = useMemo(
    () => (isOrganizer ? t('eventDetail.rankingIntroHost') : t('eventDetail.rankingIntroGuest')),
    [isOrganizer, t],
  );
  const showInitialLoading =
    !isEventWithoutDateOrBeforeStart && !isRankingLoaded && rows.length === 0;

  return (
    <View>
      {sectionTitleKey && <Text style={styles.sectionTitle}>{t(sectionTitleKey)}</Text>}
      {!isEventWithoutDateOrBeforeStart && <Text style={styles.intro}>{introText}</Text>}
      {showInitialLoading && (
        <View style={styles.loadingInitial}>
          <Spinner />
        </View>
      )}
      {isEventWithoutDateOrBeforeStart && <EventDetailRankingHostEmpty />}
      {!showInitialLoading &&
        !isEventWithoutDateOrBeforeStart &&
        rows.map((row) => <EventDetailRankingListRow key={row.id} row={row} />)}
    </View>
  );
});

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
  loadingInitial: {
    paddingVertical: 32,
    alignItems: 'center',
  },
});
