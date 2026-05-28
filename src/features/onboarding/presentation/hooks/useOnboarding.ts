import { SLIDES } from '../data';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { useCallback, useState } from 'react';
import { useWindowDimensions, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

export const useOnboarding = () => {
  const { width: screenWidth } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const { goToLogin } = useCoordinator();

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
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
    screenWidth,
  };
};
