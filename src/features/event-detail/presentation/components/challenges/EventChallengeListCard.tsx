import { EventChallengeKind, type EventChallenge } from '../../../data/eventChallenges';
import { EventChallengeCardBody } from './EventChallengeCardBody';
import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors, radii } from '@/src/ui';
import { Image, Pressable, StyleSheet } from 'react-native';

function accessibilitySummary(challenge: EventChallenge) {
  const q = challenge.question?.trim();
  return q ? q : challenge.title;
}

type Props = {
  challenge: EventChallenge;
  /** challengeId → points; persists across navigations (see `eventChallengesCompletionStore`). */
  completedByChallengeId: Record<string, number>;
  onChallengePress?: (challenge: EventChallenge) => void;
};

export function EventChallengeListCard({
  challenge,
  completedByChallengeId,
  onChallengePress,
}: Props) {
  const { t } = useTranslation();
  const isQuiz = challenge.kind === EventChallengeKind.Quiz;
  const isCompleted = Object.prototype.hasOwnProperty.call(completedByChallengeId, challenge.id);
  const pointsShown = isCompleted ? (completedByChallengeId[challenge.id] ?? 0) : 0;
  const zeroPoints = isCompleted && pointsShown === 0;

  return (
    <Pressable
      onPress={() => (isCompleted ? undefined : onChallengePress?.(challenge))}
      disabled={isCompleted}
      style={({ pressed }) => [
        styles.card,
        !isCompleted && styles.cardWithDecor,
        isCompleted && styles.cardCompleted,
        pressed && styles.cardPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={
        isCompleted
          ? t('challenges.completedWithSummary', { summary: accessibilitySummary(challenge) })
          : t('challenges.challengeA11yLine', {
              n: challenge.number,
              summary: accessibilitySummary(challenge),
            })
      }
    >
      {!isCompleted ? (
        <Image
          source={
            isQuiz
              ? images.eventDetail.challenges.quizCorner
              : images.eventDetail.challenges.photoCorner
          }
          style={styles.cornerDecor}
          resizeMode="contain"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      ) : null}

      <EventChallengeCardBody
        challenge={challenge}
        isQuiz={isQuiz}
        isCompleted={isCompleted}
        pointsShown={pointsShown}
        zeroPoints={zeroPoints}
      />

      {!isCompleted ? (
        <Image
          source={images.common.caretRight}
          style={styles.rowChevron}
          resizeMode="contain"
          accessibilityElementsHidden
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: radii.card,
    paddingVertical: 14,
    paddingLeft: 14,
    paddingRight: 14,
    marginBottom: 12,
    gap: 12,
  },
  /** Incomplete rows: corner art is absolutely positioned; clip to card and keep min height. */
  cardWithDecor: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: 100,
  },
  cardPressed: {
    opacity: 0.92,
  },
  cardCompleted: {
    backgroundColor: colors.background.tertiary,
  },
  cornerDecor: {
    position: 'absolute',
    left: -10,
    bottom: -12,
    width: 96,
    height: 96,
    zIndex: 0,
  },
  /** Right side, vertically centered (row `alignItems: 'center'`). */
  rowChevron: {
    width: 22,
    height: 22,
    zIndex: 1,
  },
});
