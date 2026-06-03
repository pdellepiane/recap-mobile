import { EventDetailTab } from '../../hooks/useEventDetailScreen';
import { images } from '@/src/assets/images';
import { AlbumPhoto } from '@/src/features/event-detail/data/eventAlbum';
import { EventChallenge } from '@/src/features/event-detail/data/eventChallenges';
import { RankingRow } from '@/src/features/event-detail/data/eventRanking';
import type { EventDetailReactionPressPayload } from '@/src/features/event-detail/data/eventReactions';
import type { EventGuestListRow } from '@/src/features/event-detail/data/eventDetailDerived';
import { EventDetailAlbumTab } from './EventDetailAlbumTab';
import { EventDetailChallengesTab } from './EventDetailChallengesTab';
import { EventDetailHero } from './EventDetailHero';
import { EventDetailOverviewTab } from './EventDetailOverviewTab';
import { EventDetailRankingTab } from './EventDetailRankingTab';
import { EventDetailTabs } from './EventDetailTabs';
import { useTranslation } from '@/src/i18n';
import { Button, colors } from '@/src/ui';
import type { ImageSourcePropType } from 'react-native';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

export type Props = {
  insetsTop: number;
  /** Bottom spacer inside the scroll (safe area + extra for FAB). */
  scrollBottomPadding: number;
  eventId: string;
  coverImageUrl?: string;
  title: string;
  onBackPress: () => void;
  onReactionPress?: (payload: EventDetailReactionPressPayload) => void;
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
  onChallengePress: (challenge: EventChallenge) => void | Promise<void>;
  completedByChallengeId: Record<string, number>;
  rankingRows: RankingRow[];
  albumPhotos: AlbumPhoto[];
  /** When set, only these tabs are shown (e.g. Detalle + Álbum for hosted events on a future calendar day). */
  visibleTabs?: readonly EventDetailTab[];
  /** Host names line from API / derived organizer copy. */
  hostsLine: string;
  isBeforeStartCountdownVisible: boolean;
  /** Organizer (event in “My events”): distinct copy and empty states in Challenges. */
  isOrganizer?: boolean;
  participantNamesLine?: string;
  confirmedGuestsCount?: number;
  totalInvitedGuestsCount?: number;
  onOpenParticipantsModal?: () => void;
  onShareEventPress?: () => void;
  /** Anfitrión en estado programado (día futuro): mostrar botón compartir. */
  showOrganizerActions?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onAlbumPhotoLike?: (photoId: string) => void;
  showChallengesPendingDot?: boolean;
};

/**
 * Scrollable body: hero, tab strip, and active tab panel for the event detail screen.
 */
export function EventDetailScrollBody({
  insetsTop,
  scrollBottomPadding,
  eventId,
  coverImageUrl,
  title,
  onBackPress,
  onReactionPress,
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
  onChallengePress,
  completedByChallengeId,
  rankingRows,
  albumPhotos,
  visibleTabs,
  hostsLine,
  isBeforeStartCountdownVisible,
  isOrganizer = false,
  participantNamesLine,
  confirmedGuestsCount,
  totalInvitedGuestsCount,
  onOpenParticipantsModal,
  onShareEventPress,
  showOrganizerActions = false,
  refreshing = false,
  onRefresh,
  onAlbumPhotoLike,
  showChallengesPendingDot = false,
}: Props) {
  const { t } = useTranslation();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      bounces
      alwaysBounceVertical
      overScrollMode="always"
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.states.active]}
            tintColor={colors.states.active}
          />
        ) : undefined
      }
    >
      <EventDetailHero
        insetsTop={insetsTop}
        eventId={eventId}
        coverImageUrl={coverImageUrl}
        eventDateIso={eventDateIso}
        title={title}
        onBackPress={onBackPress}
        onReactionPress={onReactionPress}
        onProfileAvatarPress={onProfileAvatarPress}
        liveReactionImages={liveReactionImages}
        participantNamesLine={participantNamesLine}
        confirmedGuestsCount={confirmedGuestsCount}
        totalInvitedGuestsCount={totalInvitedGuestsCount}
        onOpenGuestsModal={onOpenParticipantsModal}
        showOrganizerGuestsPill={showOrganizerActions}
      />

      {showOrganizerActions && (
        <Button
          title={t('eventDetail.shareEvent')}
          onPress={onShareEventPress ?? (() => {})}
          variant="brand"
          size="sm"
          accessibilityLabel={t('eventDetail.shareEvent')}
          rightIconSource={images.common.share}
          style={styles.shareBtn}
        />
      )}

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
          isBeforeStartCountdownVisible={isBeforeStartCountdownVisible}
          guestsAttendingCount={guestsAttendingCount}
          guestsPendingCount={guestsPendingCount}
          goingGuests={goingGuests}
        />
      ) : activeTab === EventDetailTab.Challenges ? (
        <EventDetailChallengesTab
          challenges={challenges}
          onChallengePress={onChallengePress}
          completedByChallengeId={completedByChallengeId}
          isOrganizer={isOrganizer}
        />
      ) : activeTab === EventDetailTab.Ranking ? (
        <EventDetailRankingTab rows={rankingRows} isOrganizer={isOrganizer} />
      ) : activeTab === EventDetailTab.Album ? (
        <EventDetailAlbumTab photos={albumPhotos} onAlbumPhotoLike={onAlbumPhotoLike} />
      ) : (
        <View style={styles.tabPlaceholder}>
          <Text style={styles.tabPlaceholderText}>{t('eventDetail.tabPlaceholder')}</Text>
        </View>
      )}

      <View style={{ height: scrollBottomPadding }} />
    </ScrollView>
  );
}

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
  shareBtn: {
    marginBottom: 24,
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
