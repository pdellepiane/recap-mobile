import { colors } from '@/src/ui';
import type { ImageSourcePropType } from 'react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { AlbumPhoto } from '../data/eventAlbum';
import type { EventChallenge } from '../data/eventChallenges';
import type { EventDetailExtras } from '../data/eventDetailExtras';
import type { RankingRow } from '../data/eventRanking';
import { EventDetailTab } from '../hooks/useEventDetailScreen';
import { EventDetailAlbumTab } from './EventDetailAlbumTab';
import { EventDetailChallengesTab } from './EventDetailChallengesTab';
import { EventDetailHero } from './EventDetailHero';
import { EventDetailOverviewTab } from './EventDetailOverviewTab';
import { EventDetailRankingTab } from './EventDetailRankingTab';
import { EventDetailTabs } from './EventDetailTabs';

export type EventDetailScrollBodyProps = {
  insetsTop: number;
  /** Bottom spacer inside the scroll (safe area + extra for FAB). */
  scrollBottomPadding: number;
  heroSource: { uri: string } | number | undefined;
  title: string;
  onBackPress: () => void;
  onReactionPress: (source: ImageSourcePropType, center: { x: number; y: number }) => void;
  onProfileAvatarPress?: () => void;
  liveReactionImages?: readonly [
    ImageSourcePropType,
    ImageSourcePropType,
    ImageSourcePropType,
    ImageSourcePropType,
  ];
  profileImage?: ImageSourcePropType;
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
  liveReactionImages,
  profileImage,
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
}: EventDetailScrollBodyProps) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <EventDetailHero
        insetsTop={insetsTop}
        heroSource={heroSource}
        title={title}
        onBackPress={onBackPress}
        onReactionPress={onReactionPress}
        onProfileAvatarPress={onProfileAvatarPress}
        liveReactionImages={liveReactionImages}
        profileImage={profileImage}
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
