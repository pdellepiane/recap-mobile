import { EventChallengeKind, type EventChallenge } from '../../../data/eventChallenges';
import { EventChallengeCardBody } from './EventChallengeCardBody';
import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors, radii } from '@/src/ui';
import { memo, useCallback, useMemo } from 'react';
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

export const EventChallengeListCard = memo(function EventChallengeListCard({
  challenge,
  completedByChallengeId,
  onChallengePress,
}: Props) {
  const { t } = useTranslation();
  const isQuiz = useMemo(() => challenge.kind === EventChallengeKind.Quiz, [challenge.kind]);
  const isCompleted = useMemo(
    () => Object.prototype.hasOwnProperty.call(completedByChallengeId, challenge.id),
    [challenge.id, completedByChallengeId],
  );
  const pointsShown = useMemo(
    () => (isCompleted ? (completedByChallengeId[challenge.id] ?? 0) : 0),
    [challenge.id, completedByChallengeId, isCompleted],
  );
  const zeroPoints = useMemo(() => isCompleted && pointsShown === 0, [isCompleted, pointsShown]);
  const accessibilityLabel = useMemo(() => {
    const summary = accessibilitySummary(challenge);
    if (isCompleted) {
      return t('challenges.completedWithSummary', { summary });
    }
    return t('challenges.challengeA11yLine', { n: challenge.number, summary });
  }, [challenge, isCompleted, t]);
  const onPress = useCallback(() => {
    if (!isCompleted) {
      onChallengePress?.(challenge);
    }
  }, [challenge, isCompleted, onChallengePress]);

  return (
    <Pressable
      onPress={onPress}
      disabled={isCompleted}
      style={({ pressed }) => [
        styles.card,
        !isCompleted && styles.cardWithDecor,
        isCompleted && styles.cardCompleted,
        pressed && styles.cardPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
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
});

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
