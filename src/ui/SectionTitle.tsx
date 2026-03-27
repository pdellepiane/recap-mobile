import { colors } from './colors';
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
    color: colors.neutral.primary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
    marginTop: 8,
  },
});
