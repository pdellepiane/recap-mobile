import { EventDetailTab } from '../../hooks/useEventDetailScreen';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { memo, useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  activeTab: EventDetailTab;
  onTabPress: (tab: EventDetailTab) => void;
  /** Subset of tabs to show (e.g. hosted “Mis eventos” on a future calendar day → Detalle + Álbum only). */
  visibleTabs?: readonly EventDetailTab[];
  /** GET …/challenges/pending `has_pending` (solo ventana en vivo). */
  showChallengesPendingDot?: boolean;
};

type TabDef = {
  key: EventDetailTab;
  label: string;
  showDot: boolean;
};

type TabButtonProps = {
  tab: TabDef;
  active: boolean;
  onTabPress: (tab: EventDetailTab) => void;
};

const EventDetailTabButton = memo(function EventDetailTabButton({
  tab,
  active,
  onTabPress,
}: TabButtonProps) {
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

export const EventDetailTabs = memo(function EventDetailTabs({
  activeTab,
  onTabPress,
  visibleTabs,
  showChallengesPendingDot = false,
}: Props) {
  const { t } = useTranslation();
  const detailTabs = useMemo(
    () => [
      { key: EventDetailTab.Overview, label: t('eventDetail.tabOverview'), showDot: false },
      {
        key: EventDetailTab.Challenges,
        label: t('eventDetail.tabChallenges'),
        showDot: showChallengesPendingDot,
      },
      { key: EventDetailTab.Ranking, label: t('eventDetail.tabRanking'), showDot: false },
      { key: EventDetailTab.Album, label: t('eventDetail.tabAlbum'), showDot: false },
    ],
    [t, showChallengesPendingDot],
  );

  const tabs = useMemo(() => {
    const allowed = new Set(visibleTabs ?? detailTabs.map((x) => x.key));
    return detailTabs.filter((x) => allowed.has(x.key));
  }, [detailTabs, visibleTabs]);

  return (
    <View style={styles.tabsRow}>
      {tabs.map((tab) => (
        <EventDetailTabButton
          key={tab.key}
          tab={tab}
          active={activeTab === tab.key}
          onTabPress={onTabPress}
        />
      ))}
    </View>
  );
});

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
