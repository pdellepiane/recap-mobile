import { HomeBannerCarousel, HomeFeedCarouselSections } from '../components';
import { useHomeScreen } from '../hooks/useHomeScreen';
import { colors, Spinner } from '@/src/ui';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HOME_CONTENT_INSET_LEFT = 20;

export const HomeScreenPage = () => {
  const {
    firstName,
    banners,
    myEvents,
    plans,
    pastEvents,
    hasEvents,
    isLoading,
    openEvent,
    handleLiveSlidePress,
  } = useHomeScreen();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Spinner color={colors.states.active} style={styles.spinner} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, !hasEvents && styles.safeEmpty]} edges={['top']}>
      <Text style={styles.greeting} numberOfLines={1}>
        Hola {firstName}
      </Text>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, !hasEvents && styles.scrollContentWhenEmpty]}
        showsVerticalScrollIndicator={false}
      >
        <HomeBannerCarousel banners={banners} onSlidePress={handleLiveSlidePress} />

        <HomeFeedCarouselSections
          hasEvents={hasEvents}
          myEvents={myEvents}
          plans={plans}
          pastEvents={pastEvents}
          onOpenEvent={openEvent}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  safeEmpty: {
    backgroundColor: colors.background.primary,
  },
  spinner: {
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  scrollContentWhenEmpty: {
    flexGrow: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.neutral.primary,
    marginRight: 12,
    marginBottom: 30,
    paddingTop: 4,
    paddingLeft: HOME_CONTENT_INSET_LEFT,
  },
});
