import { UserToastHost } from './UserToastHost';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  children: ReactNode;
};

/** Wraps a screen stack so toasts render above nested routes (including inner stacks). */
export function UserToastOverlay({ children }: Props) {
  return (
    <View style={styles.root}>
      {children}
      <UserToastHost />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
