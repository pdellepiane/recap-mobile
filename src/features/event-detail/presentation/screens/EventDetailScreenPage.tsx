import { EventDetailCreateChallengeSheet } from '../components/detail/EventDetailCreateChallengeSheet';
import { EventDetailScrollBody } from '../components/detail/EventDetailScrollBody';
import { EventDetailShareSheet } from '../components/detail/EventDetailShareSheet';
import { EventDetailTab, useEventDetailScreen } from '../hooks/useEventDetailScreen';
import { images } from '@/src/assets/images';
import { eventRepository } from '@/src/core/di/container';
import {
  eventGuestListGoingRows,
  eventGuestsGoing,
  eventParticipantNamesLine,
  guestsPendingCountFromEvent,
} from '@/src/features/event-detail/data/eventDetailDerived';
import { EVENT_DETAIL_LIVE_REACTION_IMAGES } from '@/src/features/event-detail/data/eventDetailLiveReactions';
import type { EventDetailReactionPressPayload } from '@/src/features/event-detail/data/eventReactions';
import { useTranslation } from '@/src/i18n';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import {
  Button,
  FloatingCameraFab,
  FloatingReactions,
  ScreenLoading,
  ScreenNotFoundFallback,
  colors,
  showShortUserMessage,
  type SpawnFloatingReaction,
} from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type EventDetailScreenPageProps = {
  eventId: string;
  initialTab?: EventDetailTab;
  completedChallengeId?: string;
  completedPoints?: number;
};

export const EventDetailScreenPage = ({
  eventId,
  initialTab,
  completedChallengeId,
  completedPoints,
}: EventDetailScreenPageProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
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
    rankingRows,
    albumPhotos,
    detailVisibleTabs,
    isBeforeStartCountdownVisible,
    isOrganizer,
    canHostEditChallenges,
    isGuestLiveActionsVisible,
    isCameraFabVisible,
    isShareSheetOpen,
    isCreateChallengeSheetOpen,
    showChallengesPendingDot,
    hostsLine,
    organizerGuestList,
    showOrganizerActions,
  } = data;

  const {
    setActiveTab,
    onPullRefresh,
    onBackPress,
    onFabCameraPress,
    onChallengePress,
    onProfileAvatarPress,
    onParticipantsModalOpen,
    onSharePress,
    onShareSheetClose,
    onShareConfirm,
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

  if (isLoading) {
    return <ScreenLoading />;
  }

  if (!event) {
    return <ScreenNotFoundFallback title={t('eventDetail.notFound')} onBackPress={goBack} />;
  }

  const scrollBody = (
    onReactionPress: ((p: EventDetailReactionPressPayload) => void) | undefined,
  ) => (
    <>
      <EventDetailScrollBody
        insetsTop={insets.top}
        scrollBottomPadding={insets.bottom + 88}
        eventId={event.id}
        refreshing={isDetailRefreshing}
        onRefresh={() => void onPullRefresh()}
        coverImageUrl={event.coverImageUrl}
        title={event.title}
        onBackPress={onBackPress}
        onReactionPress={onReactionPress}
        onProfileAvatarPress={onProfileAvatarPress}
        liveReactionImages={EVENT_DETAIL_LIVE_REACTION_IMAGES}
        activeTab={activeTab}
        onTabPress={setActiveTab}
        countdownEndsAt={countdownEndsAt}
        eventDateIso={event.date}
        addressCity={event.city}
        addressVenue={event.venue}
        mapQuery={event.location}
        guestsAttendingCount={eventGuestsGoing(event).length}
        guestsPendingCount={guestsPendingCountFromEvent(event)}
        goingGuests={eventGuestListGoingRows(event)}
        challenges={challenges}
        onChallengePress={onChallengePress}
        completedByChallengeId={completedByChallengeId}
        rankingRows={rankingRows}
        albumPhotos={albumPhotos}
        visibleTabs={detailVisibleTabs}
        hostsLine={hostsLine}
        isBeforeStartCountdownVisible={isBeforeStartCountdownVisible}
        isOrganizer={isOrganizer}
        participantNamesLine={eventParticipantNamesLine(event)}
        confirmedGuestsCount={organizerGuestList.listConfirmed}
        totalInvitedGuestsCount={organizerGuestList.listTotalInvited}
        onOpenParticipantsModal={onParticipantsModalOpen}
        onShareEventPress={onSharePress}
        showOrganizerActions={showOrganizerActions}
        onAlbumPhotoLike={onAlbumPhotoLike}
        showChallengesPendingDot={showChallengesPendingDot}
      />
      {canHostEditChallenges && (
        <Button
          title={t('eventDetail.createChallenge')}
          onPress={onCreateChallengeSheetOpen}
          accessibilityLabel={t('eventDetail.createChallenge')}
          rightIconSource={images.eventDetail.icons.createChallenge}
          rightIconStyle={styles.createChallengeFabIcon}
          style={styles.createChallengeFab}
        />
      )}
      {isCameraFabVisible ? <FloatingCameraFab onPress={onFabCameraPress} /> : null}
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
        onShare={() => void onShareConfirm()}
      />
    </>
  );

  return (
    <View style={styles.safe}>
      {isGuestLiveActionsVisible ? (
        <FloatingReactions maxConcurrent={10}>
          {(spawnAt) =>
            scrollBody((payload) => {
              void handleLiveReaction(spawnAt, payload);
            })
          }
        </FloatingReactions>
      ) : (
        scrollBody(undefined)
      )}
    </View>
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
