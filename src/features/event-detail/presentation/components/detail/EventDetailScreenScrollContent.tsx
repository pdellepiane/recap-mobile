import { EventDetailCreateChallengeSheet } from './EventDetailCreateChallengeSheet';
import { EventDetailScrollBody } from './EventDetailScrollBody';
import { EventDetailShareSheet } from './EventDetailShareSheet';
import { EventDetailTab, useEventDetailScreen } from '../../hooks/useEventDetailScreen';
import { images } from '@/src/assets/images';
import type { Event } from '@/src/domain/entities';
import { EVENT_DETAIL_LIVE_REACTION_IMAGES } from '@/src/features/event-detail/data/eventDetailLiveReactions';
import { Button } from '@/src/ui';
import { memo } from 'react';
import { StyleSheet } from 'react-native';

export type EventDetailScreenScrollContentProps = {
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

export const EventDetailScreenScrollContent = memo(function EventDetailScreenScrollContent({
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
}: EventDetailScreenScrollContentProps) {
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

const styles = StyleSheet.create({
  createChallengeFab: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 24,
  },
  createChallengeFabIcon: {
    width: 22,
    height: 22,
  },
});
