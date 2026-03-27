import { SLIDES } from '../data';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useCallback, useState } from 'react';
import { Dimensions, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const useOnboarding = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { goToLogin } = useCoordinator();

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const handleStart = useCallback(async () => {
    goToLogin();
  }, [goToLogin]);

  return {
    slides: SLIDES,
    activeIndex,
    handleScroll,
    handleStart,
    screenWidth: SCREEN_WIDTH,
  };
};
