import { HomeBannerCarousel } from '../components/HomeBannerCarousel';
import { HomeFeedCarouselSections } from '../components/HomeFeedCarouselSections';
import { useHomeScreen } from '../hooks/useHomeScreen';
import { images } from '@/src/assets/images';
import {
  AppRefreshControl,
  ScreenLoading,
  ScreenTitle,
  colors,
  useInvalidateRemoteImageCache,
} from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image } from 'expo-image';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Home tab: greeting, banner carousel, and event carousels (or empty state).
 */
export function HomeScreenPage() {
  const invalidateRemoteImageCache = useInvalidateRemoteImageCache();
  const {
    greeting,
    banners,
    myEvents,
    plans,
    pastEvents,
    hostedEventIds,
    hasEvents,
    isLoading,
    isRefreshing,
    reload,
    openEvent,
    handleSlidePress,
  } = useHomeScreen();

  const handleRefresh = useCallback(async () => {
    await invalidateRemoteImageCache();
    await reload();
  }, [invalidateRemoteImageCache, reload]);

  if (isLoading) {
    return <ScreenLoading />;
  }

  return (
    <View style={styles.root}>
      <Image
        source={images.home.background}
        style={styles.backgroundImage}
        contentFit="contain"
        contentPosition="top left"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          refreshControl={
            <AppRefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <ScreenTitle>{greeting}</ScreenTitle>
          </View>
          <HomeBannerCarousel banners={banners} onSlidePress={handleSlidePress} />
          <HomeFeedCarouselSections
            hasEvents={hasEvents}
            myEvents={myEvents}
            plans={plans}
            pastEvents={pastEvents}
            hostedEventIds={hostedEventIds}
            onOpenEvent={openEvent}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  /** Decorative asset: anchored top-left (not centered like full-screen ImageBackground + contain). */
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    maxWidth: '100%',
    width: '100%',
    height: 280,
  },
  safe: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 24,
    lineHeight: 30,
    fontFamily: fontFamilies.signikaSemiBold,
    color: colors.neutral.primary,
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 16,
  },
});
