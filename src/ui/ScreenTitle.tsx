import { colors } from './colors';
import { fontFamilies } from './typography';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

type ScreenTitleProps = {
  children: string;
  style?: object;
};

export function ScreenTitle({ children, style }: ScreenTitleProps) {
  return (
    <Animated.Text entering={FadeIn.duration(260)} style={[styles.title, style]}>
      {children}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.neutral.primary,
    fontSize: 36,
    fontFamily: fontFamilies.semiBold,
    marginBottom: 24,
    fontWeight: '600',
    lineHeight: 44,
  },
});
