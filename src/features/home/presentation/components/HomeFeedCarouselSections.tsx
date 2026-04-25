import { HomeEmptyState } from './HomeEmptyState';
import { HomeEventCarouselCard } from './HomeEventCarouselCard';
import { HomeEventVariant } from '../types';
import type { Event } from '@/src/domain/entities';
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
  onOpenEvent: (eventId: string) => void;
};

/** Empty state, or horizontal rows for “Mis eventos”, “Planes”, and “Mis eventos pasados” — each omitted when that list is empty. */
export function HomeFeedCarouselSections({
  hasEvents,
  myEvents,
  plans,
  pastEvents,
  onOpenEvent,
}: Props) {
  if (!hasEvents) {
    return <HomeEmptyState />;
  }

  const rows: {
    title: string;
    events: Event[];
    cardVariant: HomeEventVariant;
  }[] = [
    { title: 'Mis eventos', events: myEvents, cardVariant: HomeEventVariant.Hosted },
    { title: 'Planes', events: plans, cardVariant: HomeEventVariant.Guest },
    { title: 'Mis eventos pasados', events: pastEvents, cardVariant: HomeEventVariant.Hosted },
  ].filter((row) => row.events.length > 0);

  return (
    <>
      {rows.map(({ title, events, cardVariant }, rowIndex) => (
        <Fragment key={title}>
          <View style={styles.titleInset}>
            <SectionTitle>{title}</SectionTitle>
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
                variant={cardVariant}
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
