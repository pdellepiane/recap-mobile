import { EventDetailAlbumTab } from './EventDetailAlbumTab';
import { EventDetailChallengesTab } from './EventDetailChallengesTab';
import { EventDetailOverviewTab } from './EventDetailOverviewTab';
import { EventDetailRankingTab } from './EventDetailRankingTab';
import { EventDetailTabs } from './EventDetailTabs';
import { EventDetailTab } from '../../hooks/useEventDetailScreen';
import type { AlbumPhoto } from '@/src/features/event-detail/data/eventAlbum';
import type { EventChallenge } from '@/src/features/event-detail/data/eventChallenges';
import type { EventGuestListRow } from '@/src/features/event-detail/data/eventDetailDerived';
import type { RankingRow } from '@/src/features/event-detail/data/eventRanking';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  activeTab: EventDetailTab;
  onTabPress: (tab: EventDetailTab) => void;
  visibleTabs?: readonly EventDetailTab[];
  showChallengesPendingDot?: boolean;
  countdownEndsAt: Date;
  eventDateIso: string;
  addressCity?: string;
  addressVenue?: string;
  mapQuery?: string | null;
  hostsLine: string;
  guestsAttendingCount?: number;
  guestsPendingCount?: number;
  goingGuests?: EventGuestListRow[];
  challenges: EventChallenge[];
  isChallengesLoaded: boolean;
  onChallengePress: (challenge: EventChallenge) => void | Promise<void>;
  completedByChallengeId: Record<string, number>;
  rankingRows: RankingRow[];
  albumPhotos: AlbumPhoto[];
  arePhotosLoaded: boolean;
  isLoadingMoreAlbum: boolean;
  isOrganizer: boolean;
  onAlbumPhotoLike?: (photoId: string) => void;
  onAlbumPhotoPress?: (photoId: string) => void;
};

export const EventDetailTabsPanel = memo(function EventDetailTabsPanel({
  activeTab,
  onTabPress,
  visibleTabs,
  showChallengesPendingDot = false,
  countdownEndsAt,
  eventDateIso,
  addressCity,
  addressVenue,
  mapQuery,
  hostsLine,
  guestsAttendingCount,
  guestsPendingCount,
  goingGuests,
  challenges,
  isChallengesLoaded,
  onChallengePress,
  completedByChallengeId,
  rankingRows,
  albumPhotos,
  arePhotosLoaded,
  isLoadingMoreAlbum,
  isOrganizer,
  onAlbumPhotoLike,
  onAlbumPhotoPress,
}: Props) {
  const { t } = useTranslation();

  return (
    <>
      <EventDetailTabs
        activeTab={activeTab}
        onTabPress={onTabPress}
        visibleTabs={visibleTabs}
        showChallengesPendingDot={showChallengesPendingDot}
      />

      {activeTab === EventDetailTab.Overview ? (
        <EventDetailOverviewTab
          countdownEndsAt={countdownEndsAt}
          eventDateIso={eventDateIso}
          addressCity={addressCity}
          addressVenue={addressVenue}
          mapQuery={mapQuery}
          hostsLine={hostsLine}
          guestsAttendingCount={guestsAttendingCount}
          guestsPendingCount={guestsPendingCount}
          goingGuests={goingGuests}
        />
      ) : activeTab === EventDetailTab.Challenges ? (
        <EventDetailChallengesTab
          challenges={challenges}
          isChallengesLoaded={isChallengesLoaded}
          onChallengePress={onChallengePress}
          completedByChallengeId={completedByChallengeId}
          isOrganizer={isOrganizer}
          eventDateIso={eventDateIso}
        />
      ) : activeTab === EventDetailTab.Ranking ? (
        <EventDetailRankingTab
          rows={rankingRows}
          eventDateIso={eventDateIso}
          isOrganizer={isOrganizer}
        />
      ) : activeTab === EventDetailTab.Album ? (
        <EventDetailAlbumTab
          photos={albumPhotos}
          arePhotosLoaded={arePhotosLoaded}
          isLoadingMore={isLoadingMoreAlbum}
          onAlbumPhotoLike={onAlbumPhotoLike}
          onAlbumPhotoPress={onAlbumPhotoPress}
        />
      ) : (
        <View style={styles.tabPlaceholder}>
          <Text style={styles.tabPlaceholderText}>{t('eventDetail.tabPlaceholder')}</Text>
        </View>
      )}
    </>
  );
});

const styles = StyleSheet.create({
  tabPlaceholder: {
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabPlaceholderText: {
    color: colors.neutral.secondary,
    fontSize: 15,
  },
});
