import type { EventChallenge } from '../../../data/eventChallenges';
import { EventChallengeListCard } from '../challenges/EventChallengeListCard';
import { EventDetailChallengesHostEmpty } from './EventDetailChallengesHostEmpty';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text } from 'react-native';

type Props = {
  challenges: EventChallenge[];
  onChallengePress?: (challenge: EventChallenge) => void;
  /** challengeId → points; persists across navigations (see `eventChallengesCompletionStore`). */
  completedByChallengeId: Record<string, number>;
  isOrganizer?: boolean;
};

/**
 * Challenges tab: list of cards (quiz vs photo).
 */
export function EventDetailChallengesTab({
  challenges,
  onChallengePress,
  completedByChallengeId,
  isOrganizer = false,
}: Props) {
  const { t } = useTranslation();
  const sectionTitle = isOrganizer
    ? t('eventDetail.challengesSectionHost')
    : t('eventDetail.challengesSectionGuest');
  const showGuestIntro = !isOrganizer;
  const showHostIntro = isOrganizer && challenges.length > 0;
  const showHostEmpty = isOrganizer && challenges.length === 0;

  return (
    <>
      <Text style={styles.sectionTitle}>{sectionTitle}</Text>
      {showGuestIntro && <Text style={styles.intro}>{t('eventDetail.challengesGuestIntro')}</Text>}
      {showHostIntro && <Text style={styles.intro}>{t('eventDetail.challengesHostIntro')}</Text>}
      {showHostEmpty && <EventDetailChallengesHostEmpty />}
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
}

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
