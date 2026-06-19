import { HomeBannerCarousel } from '../components/HomeBannerCarousel';
import { HomeFeedCarouselSections } from '../components/HomeFeedCarouselSections';
import { HomeHeader } from '../components/HomeHeader';
import { useHomeScreen } from '../hooks/useHomeScreen';
import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { AppRefreshControl, colors, ScreenLoading } from '@/src/ui';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function HomeScreenPage() {
  const {
    displayName,
    banners,
    myEvents,
    plans,
    pastEvents,
    hostedEventIds,
    hasEvents,
    isLoading,
    isRefreshing,
    handleRefresh,
    handleOpenEvent,
    handleSlidePress,
  } = useHomeScreen();
  const { t } = useTranslation();

  if (isLoading) {
    return <ScreenLoading />;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Image
        source={images.home.background}
        style={styles.backgroundImage}
        contentFit="contain"
        contentPosition="top left"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<AppRefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
      >
        <HomeHeader greeting={t('home.greeting', { name: displayName })} />
        <HomeBannerCarousel banners={banners} onSlidePress={handleSlidePress} />
        <HomeFeedCarouselSections
          hasEvents={hasEvents}
          myEvents={myEvents}
          plans={plans}
          pastEvents={pastEvents}
          hostedEventIds={hostedEventIds}
          onOpenEvent={handleOpenEvent}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  /** Decorative asset: anchored top-left (not centered like full-screen ImageBackground + contain). */
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    maxWidth: '100%',
    width: '100%',
    height: 280,
  },
  contentContainer: {
    paddingBottom: 30,
  },
});
