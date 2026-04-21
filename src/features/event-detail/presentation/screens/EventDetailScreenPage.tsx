import {
  EventDetailTab,
  useEventDetailScreen,
} from '../../../home/presentation/hooks/useEventDetailScreen';
import { EventDetailScrollBody } from '../components/EventDetailScrollBody';
import { DEFAULT_LIVE_REACTION_IMAGES } from '@/src/features/event-detail/data/eventDetailExtras';
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
    return <ScreenNotFoundFallback title="Evento no encontrado" onBackPress={goBack} />;
  }

  return (
    <View style={styles.safe}>
      <FloatingReactions maxConcurrent={10}>
        {(spawnAt) => (
          <>
            <EventDetailScrollBody
              insetsTop={insets.top}
              scrollBottomPadding={insets.bottom + 88}
              refreshing={isDetailRefreshing}
              onRefresh={() => void onDetailPullRefresh()}
              heroSource={heroSource}
              title={title}
              onBackPress={handleDetailBack}
              onReactionPress={(source, center) => spawnAt(source, center.x, center.y)}
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
            />

            <FloatingCameraFab onPress={onFabCameraPress} />
          </>
        )}
      </FloatingReactions>
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
