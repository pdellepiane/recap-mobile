import { colors } from './colors';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';

type SpinnerProps = {
  size?: 'small' | 'large' | number;
  style?: ViewStyle | ViewStyle[];
};

export function Spinner({ size = 'large', style }: SpinnerProps) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={colors.states.active} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
