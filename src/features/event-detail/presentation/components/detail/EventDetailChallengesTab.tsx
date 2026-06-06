import type { EventChallenge } from '../../../data/eventChallenges';
import { EventChallengeListCard } from '../challenges/EventChallengeListCard';
import { EventDetailChallengesHostEmpty } from './EventDetailChallengesHostEmpty';
import { EventType } from '@/src/core/api';
import { getEventType } from '@/src/features/home/presentation/utils/eventDisplay';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { memo, useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';

type Props = {
  challenges: EventChallenge[];
  onChallengePress?: (challenge: EventChallenge) => void;
  /** challengeId → points; persists across navigations (see `eventChallengesCompletionStore`). */
  completedByChallengeId: Record<string, number>;
  isChallengesLoaded?: boolean;
  eventDateIso?: string;
  isOrganizer?: boolean;
};

/**
 * Challenges tab: list of cards (quiz vs photo).
 */
export const EventDetailChallengesTab = memo(function EventDetailChallengesTab({
  challenges,
  onChallengePress,
  completedByChallengeId,
  isChallengesLoaded = false,
  eventDateIso,
  isOrganizer = false,
}: Props) {
  const { t } = useTranslation();
  const eventType = useMemo(() => getEventType(eventDateIso), [eventDateIso]);
  const isEventWithoutDateOrBeforeStart = useMemo(
    () => eventType === EventType.EventToStart || eventType === EventType.EventWithoutDate,
    [eventType],
  );
  const sectionTitle = useMemo(
    () =>
      isOrganizer
        ? t('eventDetail.challengesSectionHost')
        : t('eventDetail.challengesSectionGuest'),
    [isOrganizer, t],
  );
  const showHostEmpty = useMemo(
    () => isOrganizer && isChallengesLoaded && challenges.length === 0,
    [challenges.length, isChallengesLoaded, isOrganizer],
  );
  const introText = useMemo(
    () =>
      isOrganizer ? t('eventDetail.challengesHostIntro') : t('eventDetail.challengesGuestIntro'),
    [isOrganizer, t],
  );
  return (
    <>
      <Text style={styles.sectionTitle}>{sectionTitle}</Text>
      {!isEventWithoutDateOrBeforeStart && <Text style={styles.intro}>{introText}</Text>}
      {isEventWithoutDateOrBeforeStart && showHostEmpty && <EventDetailChallengesHostEmpty />}
      {challenges.map((challenge) => (
        <EventChallengeListCard
          key={challenge.id}
          challenge={challenge}
          completedByChallengeId={completedByChallengeId}
          onChallengePress={onChallengePress}
        />
      ))}
    </>
  );
});

const styles = StyleSheet.create({
  sectionTitle: {
    color: colors.neutral.primary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
    marginBottom: 10,
  },
  intro: {
    color: colors.neutral.secondary,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamilies.signikaLight,
    fontWeight: '300',
    marginBottom: 20,
  },
  empty: {
    color: colors.neutral.secondary,
    fontSize: 15,
    marginBottom: 12,
  },
});
