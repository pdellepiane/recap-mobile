import { EventDetailLiveReactionProvider } from '../components/detail/EventDetailLiveReactionContext';
import { EventDetailScreenScrollContent } from '../components/detail/EventDetailScreenScrollContent';
import { EventDetailTab, useEventDetailScreen } from '../hooks/useEventDetailScreen';
import { useTranslation } from '@/src/i18n';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { FloatingCameraFab, ScreenLoading, ScreenNotFoundFallback, colors } from '@/src/ui';
import { useMemo } from 'react';
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
  openChallengeId?: string;
  openAlbumPhotoId?: string;
};

export const EventDetailScreenPage = ({
  eventId,
  initialTab,
  completedChallengeId,
  completedPoints,
  openChallengeId,
  openAlbumPhotoId,
}: EventDetailScreenPageProps) => {
  const { t } = useTranslation();
  const { goBackOrHome } = useCoordinator();
  const { data, handlers } = useEventDetailScreen({
    eventId,
    initialTab,
    completedChallengeId,
    completedPoints,
    openChallengeId,
    openAlbumPhotoId,
  });

  const {
    event,
    isLoading,
    isOrganizerRoleLoading,
    isDetailRefreshing,
    activeTab,
    completedByChallengeId,
    countdownEndsAt,
    challenges,
    isChallengesLoaded,
    rankingRows,
    isRankingLoaded,
    albumPhotos,
    arePhotosLoaded,
    albumHasMore,
    isLoadingMoreAlbum,
    detailVisibleTabs,
    isOrganizer,
    isShareSheetOpen,
    isCreateChallengeSheetOpen,
    isCameraFabVisible,
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
    onAlbumPhotoPress,
    onAlbumLoadMore,
    onLiveReaction,
  } = handlers;

  const createChallengeLabel = useMemo(() => t('eventDetail.createChallenge'), [t]);

  if (isLoading || isOrganizerRoleLoading) {
    return <ScreenLoading />;
  }

  if (!event) {
    return <ScreenNotFoundFallback title={t('eventDetail.notFound')} onBackPress={goBackOrHome} />;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <EventDetailLiveReactionProvider
        event={event}
        isOrganizer={isOrganizer}
        onLiveReaction={onLiveReaction}
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
          isRankingLoaded={isRankingLoaded}
          albumPhotos={albumPhotos}
          arePhotosLoaded={arePhotosLoaded}
          albumHasMore={albumHasMore}
          isLoadingMoreAlbum={isLoadingMoreAlbum}
          detailVisibleTabs={detailVisibleTabs}
          isOrganizer={isOrganizer}
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
          onAlbumPhotoPress={onAlbumPhotoPress}
          onAlbumLoadMore={onAlbumLoadMore}
          createChallengeLabel={createChallengeLabel}
        />
        {isCameraFabVisible && (
          <FloatingCameraFab
            onPress={onFabCameraPress}
            respectBottomSafeArea={false}
            bottomOffset={isOrganizer ? SCROLL_BOTTOM_PADDING : 0}
          />
        )}
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
});
