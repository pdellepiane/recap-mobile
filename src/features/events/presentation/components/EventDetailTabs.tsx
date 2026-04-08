import { EventDetailTab } from '../hooks/useEventDetailScreen';
import { colors } from '@/src/ui';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type EventDetailTabsProps = {
  activeTab: EventDetailTab;
  onTabPress: (tab: EventDetailTab) => void;
};

const DETAIL_TABS: readonly { key: EventDetailTab; label: string; dot?: boolean }[] = [
  { key: EventDetailTab.Overview, label: 'Detalle' },
  { key: EventDetailTab.Challenges, label: 'Challenges', dot: true },
  { key: EventDetailTab.Ranking, label: 'Ranking' },
  { key: EventDetailTab.Album, label: 'Álbum' },
];

export function EventDetailTabs({ activeTab, onTabPress }: EventDetailTabsProps) {
  return (
    <View style={styles.tabsRow}>
      {DETAIL_TABS.map((t) => {
        const active = activeTab === t.key;
        return (
          <Pressable
            key={t.key}
            onPress={() => onTabPress(t.key)}
            style={[styles.tab, active ? styles.tabActive : styles.tabInactive]}
          >
            <View style={styles.tabInner}>
              {t.dot === true ? <View style={styles.challengesDot} /> : null}
              <Text
                style={[
                  styles.tabText,
                  active && t.key !== EventDetailTab.Album ? styles.tabTextActive : null,
                ]}
              >
                {t.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
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
    backgroundColor: colors.events.challengesDot,
  },
  tabText: {
    color: colors.neutral.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.states.active,
  },
});
