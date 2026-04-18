import { colors } from './colors';
import { fontFamilies } from './typography';
import type { StyleProp, TextStyle } from 'react-native';
import { StyleSheet, Text } from 'react-native';

type SectionTitleProps = {
  children: string;
  style?: StyleProp<TextStyle>;
};

/**
 * Shared section title text for list blocks/cards.
 */
export function SectionTitle({ children, style }: SectionTitleProps) {
  return <Text style={[styles.text, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  text: {
    marginBottom: 14,
    marginTop: 8,
    fontSize: 20,
    fontFamily: fontFamilies.signikaRegular,
    color: colors.neutral.lightest,
    fontWeight: '400',
  },
});
