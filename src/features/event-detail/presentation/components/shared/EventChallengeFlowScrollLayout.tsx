import {
  EventChallengeHeaderView,
  useChallengeFlowOverlayScrollPaddingTop,
} from './EventChallengeHeaderView';
import { colors } from '@/src/ui';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

type Props = {
  children: ReactNode;
  footer: ReactNode;
  onTrash?: () => void;
  /** Modal presentation already clears the top safe area — avoid double-counting it in scroll padding. */
  modalPresentation?: boolean;
};

/** Scroll + floating header layout shared by guest and organizer quiz question screens. */
export function EventChallengeFlowScrollLayout({
  children,
  footer,
  onTrash,
  modalPresentation = false,
}: Props) {
  const scrollPaddingTop = useChallengeFlowOverlayScrollPaddingTop(modalPresentation);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: scrollPaddingTop }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
      <EventChallengeHeaderView onTrash={onTrash} overlay />
      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingHorizontal: 20,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 8,
  },
});
