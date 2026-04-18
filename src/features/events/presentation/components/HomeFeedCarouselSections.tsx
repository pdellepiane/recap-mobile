import { HomeEventCarouselCard } from './HomeEventCarouselCard';
import type { Event } from '@/src/domain/entities';
import { SectionTitle } from '@/src/ui';
import { Fragment } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const HOME_CONTENT_INSET_LEFT = 20;

type Props = {
  myEvents: Event[];
  plans: Event[];
  pastEvents: Event[];
  onOpenEvent: (eventId: string) => void;
};

/** Three horizontal rows: my events, plans, and past (home with feed). */
export function HomeFeedCarouselSections({ myEvents, plans, pastEvents, onOpenEvent }: Props) {
  const rows: {
    title: string;
    events: Event[];
    isLast?: boolean;
    cardVariant: 'hosted' | 'guest';
  }[] = [
    { title: 'Mis eventos', events: myEvents, cardVariant: 'hosted' },
    { title: 'Planes', events: plans, cardVariant: 'guest' },
    { title: 'Mis eventos pasados', events: pastEvents, isLast: true, cardVariant: 'hosted' },
  ];

  return (
    <>
      {rows.map(({ title, events, isLast, cardVariant }) => (
        <Fragment key={title}>
          <View style={styles.titleInset}>
            <SectionTitle>{title}</SectionTitle>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={isLast ? styles.hRowLast : styles.hRow}
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
