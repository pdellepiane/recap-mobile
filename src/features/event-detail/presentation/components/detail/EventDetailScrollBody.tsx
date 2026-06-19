import { useEventDetailAlbumScrollLoadMore } from '../../hooks/useEventDetailAlbumScrollLoadMore';
import { EventDetailTab } from '../../hooks/useEventDetailScreen';
import { EventDetailHero } from './EventDetailHero';
import { useEventDetailLiveReactionPress } from './EventDetailLiveReactionContext';
import { EventDetailOrganizerShareButton } from './EventDetailOrganizerShareButton';
import { EventDetailTabsPanel } from './EventDetailTabsPanel';
import { AlbumPhoto } from '@/src/features/event-detail/data/eventAlbum';
import { EventChallenge } from '@/src/features/event-detail/data/eventChallenges';
import type { EventGuestListRow } from '@/src/features/event-detail/data/eventDetailDerived';
import { RankingRow } from '@/src/features/event-detail/data/eventRanking';
import { AppRefreshControl } from '@/src/ui';
import { memo, useMemo } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { ScrollView, StyleSheet, View } from 'react-native';

export type Props = {
  insetsTop: number;
  /** Bottom spacer inside the scroll (safe area + extra for FAB). */
  scrollBottomPadding: number;
  eventId: string;
  coverImageUrl?: string;
  title: string;
  onBackPress: () => void;
  onProfileAvatarPress: () => void;
  liveReactionImages: readonly [
    ImageSourcePropType,
    ImageSourcePropType,
    ImageSourcePropType,
    ImageSourcePropType,
  ];
  activeTab: EventDetailTab;
  onTabPress: (tab: EventDetailTab) => void;
  countdownEndsAt: Date;
  eventDateIso: string;
  addressCity?: string;
  addressVenue?: string;
  mapQuery?: string | null;
  guestsAttendingCount?: number;
  guestsPendingCount?: number;
  goingGuests?: EventGuestListRow[];
  challenges: EventChallenge[];
  isChallengesLoaded: boolean;
  onChallengePress: (challenge: EventChallenge) => void | Promise<void>;
  completedByChallengeId: Record<string, number>;
  rankingRows: RankingRow[];
  isRankingLoaded: boolean;
  albumPhotos: AlbumPhoto[];
  arePhotosLoaded: boolean;
  albumHasMore?: boolean;
  isLoadingMoreAlbum?: boolean;
  /** When set, only these tabs are shown (e.g. Detalle + Álbum for hosted events on a future calendar day). */
  visibleTabs?: readonly EventDetailTab[];
  /** Host names line from API / derived organizer copy. */
  hostsLine: string;
  /** Organizer (event in “My events”): distinct copy and empty states in Challenges. */
  isOrganizer?: boolean;
  participantNamesLine?: string;
  confirmedGuestsCount?: number;
  totalInvitedGuestsCount?: number;
  onOpenParticipantsModal?: () => void;
  onShareEventPress?: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  onAlbumPhotoLike?: (photoId: string) => void;
  onAlbumPhotoPress?: (photoId: string) => void;
  onAlbumLoadMore?: () => void;
  showChallengesPendingDot?: boolean;
};

/**
 * Scrollable body: hero, tab strip, and active tab panel for the event detail screen.
 */
export const EventDetailScrollBody = memo(function EventDetailScrollBody({
  insetsTop,
  scrollBottomPadding,
  eventId,
  coverImageUrl,
  title,
  onBackPress,
  onProfileAvatarPress,
  liveReactionImages,
  activeTab,
  onTabPress,
  countdownEndsAt,
  eventDateIso,
  addressCity,
  addressVenue,
  mapQuery,
  guestsAttendingCount,
  guestsPendingCount,
  goingGuests,
  challenges,
  isChallengesLoaded,
  onChallengePress,
  completedByChallengeId,
  rankingRows,
  isRankingLoaded,
  albumPhotos,
  arePhotosLoaded,
  albumHasMore = false,
  isLoadingMoreAlbum = false,
  visibleTabs,
  hostsLine,
  isOrganizer = false,
  participantNamesLine,
  confirmedGuestsCount,
  totalInvitedGuestsCount,
  onOpenParticipantsModal,
  onShareEventPress,
  refreshing = false,
  onRefresh,
  onAlbumPhotoLike,
  onAlbumPhotoPress,
  onAlbumLoadMore,
  showChallengesPendingDot = false,
}: Props) {
  const onReactionPress = useEventDetailLiveReactionPress();
  const handleScroll = useEventDetailAlbumScrollLoadMore({
    activeTab,
    albumHasMore,
    isLoadingMoreAlbum,
    onAlbumLoadMore,
  });
  const refreshControl = useMemo(
    () =>
      onRefresh ? <AppRefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined,
    [onRefresh, refreshing],
  );
  const bottomSpacerStyle = useMemo(() => ({ height: scrollBottomPadding }), [scrollBottomPadding]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      bounces
      alwaysBounceVertical
      overScrollMode="always"
      refreshControl={refreshControl}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      <EventDetailHero
        insetsTop={insetsTop}
        coverImageUrl={coverImageUrl}
        eventDateIso={eventDateIso}
        title={title}
        onBackPress={onBackPress}
        onReactionPress={onReactionPress}
        onProfileAvatarPress={onProfileAvatarPress}
        liveReactionImages={liveReactionImages}
        isOrganizer={isOrganizer}
        participantNamesLine={participantNamesLine}
        confirmedGuestsCount={confirmedGuestsCount}
        totalInvitedGuestsCount={totalInvitedGuestsCount}
        onOpenGuestsModal={onOpenParticipantsModal}
      />

      {onShareEventPress ? (
        <EventDetailOrganizerShareButton
          eventDateIso={eventDateIso}
          isOrganizer={isOrganizer}
          onPress={onShareEventPress}
        />
      ) : null}

      <EventDetailTabsPanel
        activeTab={activeTab}
        onTabPress={onTabPress}
        visibleTabs={visibleTabs}
        showChallengesPendingDot={showChallengesPendingDot}
        countdownEndsAt={countdownEndsAt}
        eventDateIso={eventDateIso}
        addressCity={addressCity}
        addressVenue={addressVenue}
        mapQuery={mapQuery}
        hostsLine={hostsLine}
        guestsAttendingCount={guestsAttendingCount}
        guestsPendingCount={guestsPendingCount}
        goingGuests={goingGuests}
        challenges={challenges}
        isChallengesLoaded={isChallengesLoaded}
        onChallengePress={onChallengePress}
        completedByChallengeId={completedByChallengeId}
        rankingRows={rankingRows}
        isRankingLoaded={isRankingLoaded}
        albumPhotos={albumPhotos}
        arePhotosLoaded={arePhotosLoaded}
        isLoadingMoreAlbum={isLoadingMoreAlbum}
        isOrganizer={isOrganizer}
        onAlbumPhotoLike={onAlbumPhotoLike}
        onAlbumPhotoPress={onAlbumPhotoPress}
      />

      <View style={bottomSpacerStyle} />
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    zIndex: 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  hostActionsWrap: {
    marginTop: -8,
    marginBottom: 18,
  },
});
