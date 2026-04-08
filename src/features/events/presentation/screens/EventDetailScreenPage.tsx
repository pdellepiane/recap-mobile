import { useCoordinator } from '@/src/navigation/useCoordinator';
import { FloatingReactions, Spinner, colors } from '@/src/ui';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { EventDetailAlbumTab } from '../components/EventDetailAlbumTab';
import { EventDetailChallengesTab } from '../components/EventDetailChallengesTab';
import { EventDetailHero } from '../components/EventDetailHero';
import { EventDetailOverviewTab } from '../components/EventDetailOverviewTab';
import { EventDetailRankingTab } from '../components/EventDetailRankingTab';
import { EventDetailTabs } from '../components/EventDetailTabs';
import { EventDetailTab, useEventDetailScreen } from '../hooks/useEventDetailScreen';

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
    handleOpenMap,
  } = useEventDetailScreen({
    eventId,
    initialTab,
    completedChallengeId: completedChallengeId ?? completedChallengeId,
    completedPoints,
  });

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safe, styles.loaderSafe]} edges={['top', 'bottom']}>
        <Spinner color={colors.states.active} style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Text style={styles.fallbackTitle}>Evento no encontrado</Text>
        <Pressable onPress={goBack} style={styles.fallbackBtn}>
          <Text style={styles.fallbackBtnText}>Volver</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.safe}>
      <FloatingReactions maxConcurrent={10}>
        {(spawnAt) => (
          <>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <EventDetailHero
                insetsTop={insets.top}
                heroSource={heroSource as { uri: string } | number | undefined}
                title={title}
                onBackPress={handleDetailBack}
                onReactionPress={(source, center) => spawnAt(source, center.x, center.y)}
                onProfileAvatarPress={handleProfileAvatarPress}
                liveReactionImages={
                  extras?.reactionImages as readonly [number, number, number, number] | undefined
                }
                profileImage={extras?.profileImage as number | undefined}
              />

              <EventDetailTabs activeTab={activeTab} onTabPress={setActiveTab} />

              {activeTab === EventDetailTab.Overview ? (
                <EventDetailOverviewTab
                  description={description}
                  countdownEndsAt={countdownEndsAt}
                  mapsQuery={mapsQuery}
                  venueLine1={venueLine1}
                  venueLine2={venueLine2}
                  extras={extras}
                  onOpenMap={handleOpenMap}
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

              <View style={{ height: insets.bottom + 88 }} />
            </ScrollView>

            <View style={styles.fabOverlay} pointerEvents="box-none">
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={onFabCameraPress}
                style={[styles.fab, { bottom: Math.max(insets.bottom, 16) + 8 }]}
                accessibilityRole="button"
                accessibilityLabel="Abrir cámara"
                hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
              >
                <Ionicons name="camera" size={28} color={colors.background.primary} />
              </TouchableOpacity>
            </View>
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
  fabOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 300,
    elevation: 24,
  },
  loaderSafe: {
    justifyContent: 'center',
  },
  loader: {
    flex: 1,
  },
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
  fab: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.states.active,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 101,
    elevation: 25,
    shadowColor: colors.background.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  fallbackTitle: {
    color: colors.neutral.primary,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
  },
  fallbackBtn: {
    marginTop: 16,
    alignSelf: 'center',
    padding: 12,
  },
  fallbackBtnText: {
    color: colors.states.active,
    fontSize: 16,
    fontWeight: '600',
  },
});
