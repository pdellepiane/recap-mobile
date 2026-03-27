import { colors } from './colors';
import { fontFamilies } from './typography';
import { StyleSheet, Text } from 'react-native';

type ScreenTitleProps = {
  children: string;
  style?: object;
};

export function ScreenTitle({ children, style }: ScreenTitleProps) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    color: colors.neutral.primary,
    fontSize: 36,
    fontFamily: fontFamilies.semiBold,
    marginBottom: 24,
  },
});
