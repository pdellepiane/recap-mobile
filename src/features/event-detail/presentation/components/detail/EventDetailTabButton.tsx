import { EventDetailTab } from '../../../../../navigation/eventDetailTabs';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type EventDetailTabDef = {
  key: EventDetailTab;
  label: string;
  showDot: boolean;
};

type Props = {
  tab: EventDetailTabDef;
  active: boolean;
  onTabPress: (tab: EventDetailTab) => void;
};

export const EventDetailTabButton = memo(function EventDetailTabButton({
  tab,
  active,
  onTabPress,
}: Props) {
  const onPress = useCallback(() => onTabPress(tab.key), [onTabPress, tab.key]);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.tab, active ? styles.tabActive : styles.tabInactive]}
    >
      <View style={styles.tabInner}>
        {tab.showDot ? <View style={styles.challengesDot} /> : null}
        <Text
          style={[
            styles.tabText,
            active && tab.key !== EventDetailTab.Album ? styles.tabTextActive : null,
          ]}
        >
          {tab.label}
        </Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  tab: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  tabActive: {
    borderWidth: 2,
    borderColor: colors.states.active,
    backgroundColor: 'transparent',
  },
  tabInactive: {
    borderWidth: 1,
    borderColor: colors.background.elevated,
    backgroundColor: 'transparent',
  },
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  challengesDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.states.error,
  },
  tabText: {
    color: colors.neutral.primary,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    fontFamily: fontFamilies.signikaRegular,
  },
  tabTextActive: {
    color: colors.states.active,
  },
});
