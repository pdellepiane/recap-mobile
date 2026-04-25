import {
  EventDetailTab,
  useEventDetailScreen,
} from '../hooks/useEventDetailScreen';
import { EventDetailScrollBody } from '../components/EventDetailScrollBody';
import type { EventDetailReactionPressPayload } from '@/src/features/event-detail/data/eventReactions';
import { DEFAULT_LIVE_REACTION_IMAGES } from '@/src/features/event-detail/data/eventDetailExtras';
import { eventRepository } from '@/src/core/di/container';
import { useTranslation } from '@/src/i18n';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import {
  FloatingCameraFab,
  FloatingReactions,
  ScreenLoading,
  ScreenNotFoundFallback,
  colors,
} from '@/src/ui';
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
  const {
    event,
    isLoading,
    isDetailRefreshing,
    onDetailPullRefresh,
    activeTab,
    setActiveTab,
    completedByChallengeId,
    handleDetailBack,
    onFabCameraPress,
    onChallengePress,
    extras,
    countdownEndsAt,
    heroSource,
    title,
    description,
    mapsQuery,
    venueLine1,
    venueLine2,
    challenges,
    rankingRows,
    albumPhotos,
    handleProfileAvatarPress,
    liveRowCenterImage,
    handleOpenMap,
    detailVisibleTabs,
    hostsLine,
    showDetailCountdown,
    isEventHost,
    showFloatingReactions,
  } = useEventDetailScreen({
    eventId,
    initialTab,
    completedChallengeId,
    completedPoints,
  });

  if (isLoading) {
    return <ScreenLoading />;
  }

  if (!event) {
    return <ScreenNotFoundFallback title={t('eventDetail.notFound')} onBackPress={goBack} />;
  }

  const scrollBody = (onReactionPress: ((p: EventDetailReactionPressPayload) => void) | undefined) => (
    <>
      <EventDetailScrollBody
        insetsTop={insets.top}
        scrollBottomPadding={insets.bottom + 88}
        refreshing={isDetailRefreshing}
        onRefresh={() => void onDetailPullRefresh()}
        heroSource={heroSource}
        title={title}
        onBackPress={handleDetailBack}
        onReactionPress={onReactionPress}
        onProfileAvatarPress={handleProfileAvatarPress}
        liveRowCenterImage={liveRowCenterImage}
        liveReactionImages={extras?.reactionImages ?? DEFAULT_LIVE_REACTION_IMAGES}
        activeTab={activeTab}
        onTabPress={setActiveTab}
        description={description}
        countdownEndsAt={countdownEndsAt}
        mapsQuery={mapsQuery}
        venueLine1={venueLine1}
        venueLine2={venueLine2}
        extras={extras}
        onOpenMap={handleOpenMap}
        challenges={challenges}
        onChallengePress={onChallengePress}
        completedByChallengeId={completedByChallengeId}
        rankingRows={rankingRows}
        albumPhotos={albumPhotos}
        visibleTabs={detailVisibleTabs}
        hostsLine={hostsLine}
        showDetailCountdown={showDetailCountdown}
        isEventHost={isEventHost}
      />
      <FloatingCameraFab onPress={onFabCameraPress} />
    </>
  );

  return (
    <View style={styles.safe}>
      {showFloatingReactions ? (
        <FloatingReactions maxConcurrent={10}>
          {(spawnAt) =>
            scrollBody(({ reaction, source, center }) => {
              void eventRepository.postEventReaction(event.id, reaction);
              spawnAt(source, center.x, center.y);
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
});
