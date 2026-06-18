import {
  EventDetailTabButton,
  type EventDetailTabDef,
} from './EventDetailTabButton';
import { EventDetailTab } from '../../hooks/useEventDetailScreen';
import { useTranslation } from '@/src/i18n';
import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  activeTab: EventDetailTab;
  onTabPress: (tab: EventDetailTab) => void;
  /** Subset of tabs to show (e.g. hosted “Mis eventos” on a future calendar day → Detalle + Álbum only). */
  visibleTabs?: readonly EventDetailTab[];
  /** GET …/challenges/pending `has_pending` (solo ventana en vivo). */
  showChallengesPendingDot?: boolean;
};

export const EventDetailTabs = memo(function EventDetailTabs({
  activeTab,
  onTabPress,
  visibleTabs,
  showChallengesPendingDot = false,
}: Props) {
  const { t } = useTranslation();
  const detailTabs = useMemo<EventDetailTabDef[]>(
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
});
