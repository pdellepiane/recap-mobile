import { EventDetailCameraFabGate } from '../components/detail/EventDetailCameraFabGate';
import { EventDetailCreateChallengeSheet } from '../components/detail/EventDetailCreateChallengeSheet';
import { EventDetailLiveReactionProvider } from '../components/detail/EventDetailLiveReactionContext';
import { EventDetailScrollBody } from '../components/detail/EventDetailScrollBody';
import { EventDetailShareSheet } from '../components/detail/EventDetailShareSheet';
import { EventDetailTab, useEventDetailScreen } from '../hooks/useEventDetailScreen';
import { images } from '@/src/assets/images';
import { eventRepository } from '@/src/core/di/container';
import { EVENT_DETAIL_LIVE_REACTION_IMAGES } from '@/src/features/event-detail/data/eventDetailLiveReactions';
import type { EventDetailReactionPressPayload } from '@/src/features/event-detail/data/eventReactions';
import type { Event } from '@/src/domain/entities';
import { useTranslation } from '@/src/i18n';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import {
  Button,
  ScreenLoading,
  ScreenNotFoundFallback,
  colors,
  showShortUserMessage,
  type SpawnFloatingReaction,
} from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { memo, useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** Hero back row padding below the top safe area. */
const HERO_TOP_PADDING = 8;
/** Scroll end spacer — room for the bottom create-challenge CTA. */
const SCROLL_BOTTOM_PADDING = 88;

type EventDetailScreenPageProps = {
  eventId: string;
  initialTab?: EventDetailTab;
  completedChallengeId?: string;
  completedPoints?: number;
};

type ScrollContentProps = {
  event: Event;
  insetsTop: number;
  scrollBottomPadding: number;
  isDetailRefreshing: boolean;
  activeTab: EventDetailTab;
  completedByChallengeId: Record<string, number>;
  countdownEndsAt: Date;
  challenges: ReturnType<typeof useEventDetailScreen>['data']['challenges'];
  isChallengesLoaded: boolean;
  rankingRows: ReturnType<typeof useEventDetailScreen>['data']['rankingRows'];
  albumPhotos: ReturnType<typeof useEventDetailScreen>['data']['albumPhotos'];
  arePhotosLoaded: boolean;
  detailVisibleTabs: readonly EventDetailTab[];
  isOrganizer: boolean;
  canHostEditChallenges: boolean;
  showChallengesPendingDot: boolean;
  hostsLine: string;
  goingGuests: ReturnType<typeof useEventDetailScreen>['data']['goingGuests'];
  guestsAttendingCount: number;
  guestsPendingCount: number | undefined;
  participantNamesLine: string;
  organizerGuestList: ReturnType<typeof useEventDetailScreen>['data']['organizerGuestList'];
  isShareSheetOpen: boolean;
  isCreateChallengeSheetOpen: boolean;
  onDetailRefresh: () => void;
  onBackPress: () => void;
  onTabPress: (tab: EventDetailTab) => void;
  onChallengePress: ReturnType<typeof useEventDetailScreen>['handlers']['onChallengePress'];
  onProfileAvatarPress: () => void;
  onParticipantsModalOpen: () => void;
  onSharePress: () => void;
  onShareSheetClose: () => void;
  onShareConfirmPress: () => void;
  onCreateChallengeSheetOpen: () => void;
  onCreateChallengeSheetClose: () => void;
  onCreateQuizChallengeSelect: () => void;
  onCreatePhotoChallengeSelect: () => void;
  onAlbumPhotoLike: (photoId: string) => void;
  createChallengeLabel: string;
};

const EventDetailScreenScrollContent = memo(function EventDetailScreenScrollContent({
  event,
  insetsTop,
  scrollBottomPadding,
  isDetailRefreshing,
  activeTab,
  completedByChallengeId,
  countdownEndsAt,
  challenges,
  isChallengesLoaded,
  rankingRows,
  albumPhotos,
  arePhotosLoaded,
  detailVisibleTabs,
  isOrganizer,
  canHostEditChallenges,
  showChallengesPendingDot,
  hostsLine,
  goingGuests,
  guestsAttendingCount,
  guestsPendingCount,
  participantNamesLine,
  organizerGuestList,
  isShareSheetOpen,
  isCreateChallengeSheetOpen,
  onDetailRefresh,
  onBackPress,
  onTabPress,
  onChallengePress,
  onProfileAvatarPress,
  onParticipantsModalOpen,
  onSharePress,
  onShareSheetClose,
  onShareConfirmPress,
  onCreateChallengeSheetOpen,
  onCreateChallengeSheetClose,
  onCreateQuizChallengeSelect,
  onCreatePhotoChallengeSelect,
  onAlbumPhotoLike,
  createChallengeLabel,
}: ScrollContentProps) {
  return (
    <>
      <EventDetailScrollBody
        insetsTop={insetsTop}
        scrollBottomPadding={scrollBottomPadding}
        eventId={event.id}
        refreshing={isDetailRefreshing}
        onRefresh={onDetailRefresh}
        coverImageUrl={event.coverImageUrl}
        title={event.title}
        onBackPress={onBackPress}
        onProfileAvatarPress={onProfileAvatarPress}
        liveReactionImages={EVENT_DETAIL_LIVE_REACTION_IMAGES}
        activeTab={activeTab}
        onTabPress={onTabPress}
        countdownEndsAt={countdownEndsAt}
        eventDateIso={event.date}
        addressCity={event.city}
        addressVenue={event.venue}
        mapQuery={event.location}
        guestsAttendingCount={guestsAttendingCount}
        guestsPendingCount={guestsPendingCount}
        goingGuests={goingGuests}
        challenges={challenges}
        isChallengesLoaded={isChallengesLoaded}
        onChallengePress={onChallengePress}
        completedByChallengeId={completedByChallengeId}
        rankingRows={rankingRows}
        albumPhotos={albumPhotos}
        arePhotosLoaded={arePhotosLoaded}
        visibleTabs={detailVisibleTabs}
        hostsLine={hostsLine}
        isOrganizer={isOrganizer}
        participantNamesLine={participantNamesLine}
        confirmedGuestsCount={organizerGuestList.listConfirmed}
        totalInvitedGuestsCount={organizerGuestList.listTotalInvited}
        onOpenParticipantsModal={onParticipantsModalOpen}
        onShareEventPress={onSharePress}
        onAlbumPhotoLike={onAlbumPhotoLike}
        showChallengesPendingDot={showChallengesPendingDot}
      />
      {canHostEditChallenges ? (
        <Button
          title={createChallengeLabel}
          onPress={onCreateChallengeSheetOpen}
          accessibilityLabel={createChallengeLabel}
          rightIconSource={images.eventDetail.icons.createChallenge}
          rightIconStyle={styles.createChallengeFabIcon}
          style={styles.createChallengeFab}
        />
      ) : null}
      <EventDetailCreateChallengeSheet
        visible={isCreateChallengeSheetOpen}
        onClose={onCreateChallengeSheetClose}
        onSelectQuiz={onCreateQuizChallengeSelect}
        onSelectPhoto={onCreatePhotoChallengeSelect}
      />
      <EventDetailShareSheet
        visible={isShareSheetOpen}
        shareUrl={event.shareUrl}
        onClose={onShareSheetClose}
        onShare={onShareConfirmPress}
      />
    </>
  );
});

export const EventDetailScreenPage = ({
  eventId,
  initialTab,
  completedChallengeId,
  completedPoints,
}: EventDetailScreenPageProps) => {
  const { t } = useTranslation();
  const { goBack } = useCoordinator();
  const { data, handlers } = useEventDetailScreen({
    eventId,
    initialTab,
    completedChallengeId,
    completedPoints,
  });

  const {
    event,
    isLoading,
    isDetailRefreshing,
    activeTab,
    completedByChallengeId,
    countdownEndsAt,
    challenges,
    isChallengesLoaded,
    rankingRows,
    albumPhotos,
    arePhotosLoaded,
    detailVisibleTabs,
    isOrganizer,
    canHostEditChallenges,
    isShareSheetOpen,
    isCreateChallengeSheetOpen,
    showChallengesPendingDot,
    hostsLine,
    organizerGuestList,
    goingGuests,
    guestsAttendingCount,
    guestsPendingCount,
    participantNamesLine,
  } = data;

  const {
    setActiveTab,
    onDetailRefresh,
    onBackPress,
    onFabCameraPress,
    onChallengePress,
    onProfileAvatarPress,
    onParticipantsModalOpen,
    onSharePress,
    onShareSheetClose,
    onShareConfirmPress,
    onCreateChallengeSheetOpen,
    onCreateChallengeSheetClose,
    onCreateQuizChallengeSelect,
    onCreatePhotoChallengeSelect,
    onAlbumPhotoLike,
  } = handlers;

  const handleLiveReaction = useCallback(
    async (
      spawnAt: SpawnFloatingReaction,
      { reaction, source, center }: EventDetailReactionPressPayload,
    ) => {
      if (!event?.id) {
        return;
      }
      const ok = await eventRepository.postEventReaction(event.id, reaction);
      if (ok) {
        spawnAt(source, center.x, center.y);
        return;
      }
      showShortUserMessage(t('eventDetail.reactionError'));
    },
    [event?.id, t],
  );
  const createChallengeLabel = useMemo(() => t('eventDetail.createChallenge'), [t]);

  if (isLoading) {
    return <ScreenLoading />;
  }

  if (!event) {
    return <ScreenNotFoundFallback title={t('eventDetail.notFound')} onBackPress={goBack} />;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <EventDetailLiveReactionProvider
        event={event}
        isOrganizer={isOrganizer}
        onLiveReaction={handleLiveReaction}
      >
        <EventDetailScreenScrollContent
          event={event}
          insetsTop={HERO_TOP_PADDING}
          scrollBottomPadding={SCROLL_BOTTOM_PADDING}
          isDetailRefreshing={isDetailRefreshing}
          activeTab={activeTab}
          completedByChallengeId={completedByChallengeId}
          countdownEndsAt={countdownEndsAt}
          challenges={challenges}
          isChallengesLoaded={isChallengesLoaded}
          rankingRows={rankingRows}
          albumPhotos={albumPhotos}
          arePhotosLoaded={arePhotosLoaded}
          detailVisibleTabs={detailVisibleTabs}
          isOrganizer={isOrganizer}
          canHostEditChallenges={canHostEditChallenges}
          showChallengesPendingDot={showChallengesPendingDot}
          hostsLine={hostsLine}
          goingGuests={goingGuests}
          guestsAttendingCount={guestsAttendingCount}
          guestsPendingCount={guestsPendingCount}
          participantNamesLine={participantNamesLine}
          organizerGuestList={organizerGuestList}
          isShareSheetOpen={isShareSheetOpen}
          isCreateChallengeSheetOpen={isCreateChallengeSheetOpen}
          onDetailRefresh={onDetailRefresh}
          onBackPress={onBackPress}
          onTabPress={setActiveTab}
          onChallengePress={onChallengePress}
          onProfileAvatarPress={onProfileAvatarPress}
          onParticipantsModalOpen={onParticipantsModalOpen}
          onSharePress={onSharePress}
          onShareSheetClose={onShareSheetClose}
          onShareConfirmPress={onShareConfirmPress}
          onCreateChallengeSheetOpen={onCreateChallengeSheetOpen}
          onCreateChallengeSheetClose={onCreateChallengeSheetClose}
          onCreateQuizChallengeSelect={onCreateQuizChallengeSelect}
          onCreatePhotoChallengeSelect={onCreatePhotoChallengeSelect}
          onAlbumPhotoLike={onAlbumPhotoLike}
          createChallengeLabel={createChallengeLabel}
        />
        <EventDetailCameraFabGate eventDateIso={event.date} onPress={onFabCameraPress} />
      </EventDetailLiveReactionProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background.primary,
    position: 'relative',
  },
  createChallengeFab: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 24,
  },
  createChallengeFabText: {
    color: colors.background.primary,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fontFamilies.signikaSemiBold,
  },
  createChallengeFabIcon: {
    width: 22,
    height: 22,
  },
});
