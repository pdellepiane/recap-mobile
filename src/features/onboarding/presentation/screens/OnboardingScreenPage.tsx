import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProgressBar, SlideItem, StartButton } from '../components';
import { useOnboarding } from '../hooks/useOnboarding';

export const OnboardingScreenPage = () => {
  const insets = useSafeAreaInsets();
  const { slides, activeIndex, handleScroll, handleStart, screenWidth } = useOnboarding();

  return (
    <>
      <FlatList
        data={slides}
        renderItem={({ item }) => <SlideItem slide={item} width={screenWidth} />}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
      />
      <View pointerEvents="box-none" style={styles.overlay}>
        <ProgressBar slides={slides} activeIndex={activeIndex} topInset={insets.top} />
        <StartButton onPress={handleStart} bottomInset={insets.bottom} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
});
