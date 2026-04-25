import { EventDetailTab } from '../hooks/useEventDetailScreen';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  activeTab: EventDetailTab;
  onTabPress: (tab: EventDetailTab) => void;
  /** Subset of tabs to show (e.g. hosted “Mis eventos” on a future calendar day → Detalle + Álbum only). */
  visibleTabs?: readonly EventDetailTab[];
};

export function EventDetailTabs({ activeTab, onTabPress, visibleTabs }: Props) {
  const { t } = useTranslation();
  const detailTabs = useMemo(
    () => [
      { key: EventDetailTab.Overview, label: t('eventDetail.tabOverview') },
      { key: EventDetailTab.Challenges, label: t('eventDetail.tabChallenges'), dot: true },
      { key: EventDetailTab.Ranking, label: t('eventDetail.tabRanking') },
      { key: EventDetailTab.Album, label: t('eventDetail.tabAlbum') },
    ],
    [t],
  );

  const allowed = new Set(visibleTabs ?? detailTabs.map((x) => x.key));
  const tabs = detailTabs.filter((x) => allowed.has(x.key));

  return (
    <View style={styles.tabsRow}>
      {tabs.map((tab) => {
        const active = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
            style={[styles.tab, active ? styles.tabActive : styles.tabInactive]}
          >
            <View style={styles.tabInner}>
              {tab.dot === true ? <View style={styles.challengesDot} /> : null}
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
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    fontFamily: fontFamilies.signikaRegular,
  },
  tabTextActive: {
    color: colors.states.active,
  },
});
