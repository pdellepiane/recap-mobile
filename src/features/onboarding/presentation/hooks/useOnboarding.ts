import { useCoordinator } from "@/src/navigation/useCoordinator";
import { useState } from "react";
import {
  Dimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { SLIDES } from "../data";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const useOnboarding = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { goToLogin } = useCoordinator();

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  return {
    slides: SLIDES,
    activeIndex,
    handleScroll,
    handleStart: goToLogin,
    screenWidth: SCREEN_WIDTH,
  };
};
