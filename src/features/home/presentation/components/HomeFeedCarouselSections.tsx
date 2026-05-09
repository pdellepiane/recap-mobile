import { HomeEmptyState } from './HomeEmptyState';
import { HomeEventCarouselCard } from './HomeEventCarouselCard';
import { HomeEventVariant } from '../types';
import type { Event } from '@/src/domain/entities';
import { useTranslation } from '@/src/i18n';
import { SectionTitle } from '@/src/ui';
import { Fragment } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const HOME_CONTENT_INSET_LEFT = 20;

type Props = {
  /** When false, shows {@link HomeEmptyState} instead of carousels. */
  hasEvents: boolean;
  myEvents: Event[];
  plans: Event[];
  pastEvents: Event[];
  /** From host feed; past-row cards use guest styling when the id is not hosted. */
  hostedEventIds: ReadonlySet<string>;
  onOpenEvent: (eventId: string) => void;
};

/** Empty state, or horizontal rows for “Mis eventos”, “Planes”, and “Mis eventos pasados” — each omitted when that list is empty. */
export function HomeFeedCarouselSections({
  hasEvents,
  myEvents,
  plans,
  pastEvents,
  hostedEventIds,
  onOpenEvent,
}: Props) {
  const { t } = useTranslation();

  if (!hasEvents) {
    return <HomeEmptyState />;
  }

  const allRows: {
    rowKey: string;
    titleKey: string;
    events: Event[];
    cardVariant: HomeEventVariant | 'byHostMembership';
  }[] = [
    {
      rowKey: 'myEvents',
      titleKey: 'home.carouselMyEvents',
      events: myEvents,
      cardVariant: HomeEventVariant.Hosted,
    },
    {
      rowKey: 'plans',
      titleKey: 'home.carouselPlans',
      events: plans,
      cardVariant: HomeEventVariant.Guest,
    },
    {
      rowKey: 'past',
      titleKey: 'home.carouselPastEvents',
      events: pastEvents,
      cardVariant: 'byHostMembership',
    },
  ];
  const rows = allRows.filter((row) => row.events.length > 0);

  return (
    <>
      {rows.map(({ rowKey, titleKey, events, cardVariant }, rowIndex) => (
        <Fragment key={rowKey}>
          <View style={styles.titleInset}>
            <SectionTitle>{t(titleKey)}</SectionTitle>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={
              rowIndex === rows.length - 1 ? styles.hRowLast : styles.hRow
            }
          >
            {events.map((item, index) => (
              <HomeEventCarouselCard
                key={item.id}
                event={item}
                index={index}
                variant={
                  cardVariant === 'byHostMembership'
                    ? hostedEventIds.has(item.id)
                      ? HomeEventVariant.Hosted
                      : HomeEventVariant.Guest
                    : cardVariant
                }
                onPress={() => onOpenEvent(item.id)}
              />
            ))}
          </ScrollView>
        </Fragment>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  titleInset: {
    paddingLeft: HOME_CONTENT_INSET_LEFT,
  },
  hRow: {
    paddingLeft: HOME_CONTENT_INSET_LEFT,
    marginBottom: 8,
  },
  hRowLast: {
    paddingLeft: HOME_CONTENT_INSET_LEFT,
    marginBottom: 24,
  },
});
