import { EventDetailTab } from '../../../home/presentation/hooks/useEventDetailScreen';
import { AlbumPhoto } from '@/src/features/event-detail/data/eventAlbum';
import { EventChallenge } from '@/src/features/event-detail/data/eventChallenges';
import { EventDetailExtras } from '@/src/features/event-detail/data/eventDetailExtras';
import { RankingRow } from '@/src/features/event-detail/data/eventRanking';
import { EventDetailAlbumTab } from '@/src/features/event-detail/presentation/components/EventDetailAlbumTab';
import { EventDetailChallengesTab } from '@/src/features/event-detail/presentation/components/EventDetailChallengesTab';
import { EventDetailHero } from '@/src/features/event-detail/presentation/components/EventDetailHero';
import { EventDetailOverviewTab } from '@/src/features/event-detail/presentation/components/EventDetailOverviewTab';
import { EventDetailRankingTab } from '@/src/features/event-detail/presentation/components/EventDetailRankingTab';
import { EventDetailTabs } from '@/src/features/event-detail/presentation/components/EventDetailTabs';
import { colors } from '@/src/ui';
import type { ImageSourcePropType } from 'react-native';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

export type EventDetailScrollBodyProps = {
  insetsTop: number;
  /** Bottom spacer inside the scroll (safe area + extra for FAB). */
  scrollBottomPadding: number;
  heroSource: { uri: string } | number | undefined;
  title: string;
  onBackPress: () => void;
  onReactionPress: (source: ImageSourcePropType, center: { x: number; y: number }) => void;
  onProfileAvatarPress: () => void;
  /** Center image in the reaction row (cover, or story author when statuses exist). */
  liveRowCenterImage: ImageSourcePropType;
  liveReactionImages: readonly [
    ImageSourcePropType,
    ImageSourcePropType,
    ImageSourcePropType,
    ImageSourcePropType,
  ];
  activeTab: EventDetailTab;
  onTabPress: (tab: EventDetailTab) => void;
  description: string;
  countdownEndsAt: Date;
  mapsQuery: string | null;
  venueLine1: string;
  venueLine2: string;
  extras: EventDetailExtras | null;
  onOpenMap: () => void;
  challenges: EventChallenge[];
  onChallengePress: (challenge: EventChallenge) => void | Promise<void>;
  completedByChallengeId: Record<string, number>;
  rankingRows: RankingRow[];
  albumPhotos: AlbumPhoto[];
  /** When set, only these tabs are shown (e.g. Detalle + Álbum for hosted events on a future calendar day). */
  visibleTabs?: readonly EventDetailTab[];
  /** Host names line (API `hosts` or extras mock). */
  hostsLine: string;
  showDetailCountdown: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
};

/**
 * Scrollable body: hero, tab strip, and active tab panel for the event detail screen.
 */
export function EventDetailScrollBody({
  insetsTop,
  scrollBottomPadding,
  heroSource,
  title,
  onBackPress,
  onReactionPress,
  onProfileAvatarPress,
  liveRowCenterImage,
  liveReactionImages,
  activeTab,
  onTabPress,
  description,
  countdownEndsAt,
  mapsQuery,
  venueLine1,
  venueLine2,
  extras,
  onOpenMap,
  challenges,
  onChallengePress,
  completedByChallengeId,
  rankingRows,
  albumPhotos,
  visibleTabs,
  hostsLine,
  showDetailCountdown,
  refreshing = false,
  onRefresh,
}: EventDetailScrollBodyProps) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
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
        heroSource={heroSource}
        title={title}
        onBackPress={onBackPress}
        onReactionPress={onReactionPress}
        onProfileAvatarPress={onProfileAvatarPress}
        liveRowCenterImage={liveRowCenterImage}
        liveReactionImages={liveReactionImages}
      />

      <EventDetailTabs activeTab={activeTab} onTabPress={onTabPress} visibleTabs={visibleTabs} />

      {activeTab === EventDetailTab.Overview ? (
        <EventDetailOverviewTab
          description={description}
          countdownEndsAt={countdownEndsAt}
          mapsQuery={mapsQuery}
          venueLine1={venueLine1}
          venueLine2={venueLine2}
          extras={extras}
          hostsLine={hostsLine}
          showDetailCountdown={showDetailCountdown}
          onOpenMap={onOpenMap}
        />
      ) : activeTab === EventDetailTab.Challenges ? (
        <EventDetailChallengesTab
          challenges={challenges}
          onChallengePress={onChallengePress}
          completedByChallengeId={completedByChallengeId}
        />
      ) : activeTab === EventDetailTab.Ranking ? (
        <EventDetailRankingTab rows={rankingRows} />
      ) : activeTab === EventDetailTab.Album ? (
        <EventDetailAlbumTab photos={albumPhotos} />
      ) : (
        <View style={styles.tabPlaceholder}>
          <Text style={styles.tabPlaceholderText}>Contenido disponible pronto</Text>
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
