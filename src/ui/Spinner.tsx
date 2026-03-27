import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';

type SpinnerProps = {
  size?: 'small' | 'large' | number;
  color?: string;
  style?: ViewStyle | ViewStyle[];
};

export function Spinner({ size = 'large', color = '#2563eb', style }: SpinnerProps) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
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
