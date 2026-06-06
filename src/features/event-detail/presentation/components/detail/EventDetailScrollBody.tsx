import { EventDetailTab } from '../../hooks/useEventDetailScreen';
import { EventDetailAlbumTab } from './EventDetailAlbumTab';
import { EventDetailChallengesTab } from './EventDetailChallengesTab';
import { EventDetailHero } from './EventDetailHero';
import { useEventDetailLiveReactionPress } from './EventDetailLiveReactionContext';
import { EventDetailOrganizerShareButton } from './EventDetailOrganizerShareButton';
import { EventDetailOverviewTab } from './EventDetailOverviewTab';
import { EventDetailRankingTab } from './EventDetailRankingTab';
import { EventDetailTabs } from './EventDetailTabs';
import { AlbumPhoto } from '@/src/features/event-detail/data/eventAlbum';
import { EventChallenge } from '@/src/features/event-detail/data/eventChallenges';
import type { EventGuestListRow } from '@/src/features/event-detail/data/eventDetailDerived';
import { RankingRow } from '@/src/features/event-detail/data/eventRanking';
import { useTranslation } from '@/src/i18n';
import { AppRefreshControl, colors } from '@/src/ui';
import { memo, useMemo } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

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
  albumPhotos: AlbumPhoto[];
  arePhotosLoaded: boolean;
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
  albumPhotos,
  arePhotosLoaded,
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
  showChallengesPendingDot = false,
}: Props) {
  const { t } = useTranslation();
  const onReactionPress = useEventDetailLiveReactionPress();
  const refreshControl = useMemo(
    () =>
      onRefresh ? (
        <AppRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      ) : undefined,
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
          onAlbumPhotoLike={onAlbumPhotoLike}
        />
      ) : (
        <View style={styles.tabPlaceholder}>
          <Text style={styles.tabPlaceholderText}>{t('eventDetail.tabPlaceholder')}</Text>
        </View>
      )}

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
