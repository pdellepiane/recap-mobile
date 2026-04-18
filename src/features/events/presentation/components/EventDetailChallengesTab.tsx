import type { EventChallenge } from '../data/eventChallenges';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

const CHALLENGE_CHEVRON = require('../../../../../assets/images/event-detail/challenges/reto-chevron-right.png');
const CHALLENGE_QUIZ_CORNER = require('../../../../../assets/images/event-detail/challenges/reto-quiz-corner.png');
const CHALLENGE_QUIZ_LABEL_ICON = require('../../../../../assets/images/question-icon.png');
const CHALLENGE_PHOTO_CORNER = require('../../../../../assets/images/event-detail/challenges/reto-photo-corner.png');
const CHALLENGE_PHOTO_LABEL_ICON = require('../../../../../assets/images/event-detail/challenges/reto-photo-label-icon.png');

const INTRO =
  'Los anfitriones han planteado diferentes challenges para que puedan ser resueltos por sus invitados, anímate a resolverlos.';

/** Lime accent for completed challenges / points, aligned with design. */
const CHALLENGE_ACCENT_LIME = colors.states.active;

function titleOneLine(title: string) {
  return title.replace(/\s*\n+\s*/g, ' ').trim();
}

type Props = {
  challenges: EventChallenge[];
  onChallengePress?: (challenge: EventChallenge) => void;
  /** challengeId → points; persists across navigations (see `eventChallengesCompletionStore`). */
  completedByChallengeId: Record<string, number>;
};

/**
 * Challenges tab: fixed intro copy + list of cards (quiz vs photo).
 */
export function EventDetailChallengesTab({
  challenges,
  onChallengePress,
  completedByChallengeId,
}: Props) {
  return (
    <View>
      <Text style={styles.sectionTitle}>Challenges del evento</Text>
      <Text style={styles.intro}>{INTRO}</Text>

      {challenges.length === 0 ? (
        <Text style={styles.empty}>No hay challenges en este evento.</Text>
      ) : null}

      {challenges.map((challenge) => {
        const isQuiz = challenge.kind === 'quiz';
        const isCompleted = Object.prototype.hasOwnProperty.call(
          completedByChallengeId,
          challenge.id,
        );
        const pointsShown = isCompleted ? (completedByChallengeId[challenge.id] ?? 0) : 0;
        const zeroPoints = isCompleted && pointsShown === 0;
        return (
          <Pressable
            key={challenge.id}
            onPress={() => (isCompleted ? undefined : onChallengePress?.(challenge))}
            disabled={isCompleted}
            style={({ pressed }) => [
              styles.card,
              styles.cardWithDecor,
              isCompleted && styles.cardCompleted,
              pressed && styles.cardPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={
              isCompleted
                ? `Completado: ${challenge.title}`
                : `Challenge ${String(challenge.number)}: ${challenge.title}`
            }
          >
            {!isCompleted ? (
              <Image
                source={isQuiz ? CHALLENGE_QUIZ_CORNER : CHALLENGE_PHOTO_CORNER}
                style={styles.cornerDecor}
                resizeMode="contain"
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              />
            ) : null}

            <View style={[styles.cardBody, isCompleted && styles.cardBodyCompleted]}>
              {isCompleted ? (
                <View style={styles.completedTopRow} pointerEvents="none">
                  <Ionicons name="checkmark" size={20} color={colors.neutral.primary} />
                  <Text
                    style={[
                      styles.completedLabel,
                      isQuiz ? styles.completedLabelQuiz : styles.completedLabelPhoto,
                    ]}
                  >
                    ¡Completado!
                  </Text>
                  <Text style={[styles.completedPoints, zeroPoints && styles.completedPointsZero]}>
                    {`${String(pointsShown)} ptos`}
                  </Text>
                </View>
              ) : (
                <View style={styles.labelRow}>
                  {isQuiz ? (
                    <Image
                      source={CHALLENGE_QUIZ_LABEL_ICON}
                      style={styles.labelLeadIcon}
                      resizeMode="contain"
                      accessibilityElementsHidden
                    />
                  ) : (
                    <Image
                      source={CHALLENGE_PHOTO_LABEL_ICON}
                      style={styles.labelLeadIcon}
                      resizeMode="contain"
                      accessibilityElementsHidden
                    />
                  )}
                  <Text
                    style={[
                      styles.challengeLabel,
                      isQuiz ? styles.challengeLabelQuiz : styles.challengeLabelPhoto,
                    ]}
                  >
                    {`Challenge ${String(challenge.number)}`}
                  </Text>
                </View>
              )}
              <Text
                style={styles.challengeTitle}
                numberOfLines={isCompleted ? 2 : 4}
                ellipsizeMode="tail"
              >
                {titleOneLine(challenge.title)}
              </Text>
            </View>

            {isCompleted ? null : (
              <Image
                source={CHALLENGE_CHEVRON}
                style={styles.rowChevron}
                resizeMode="contain"
                accessibilityElementsHidden
              />
            )}
          </Pressable>
        );
      })}
    </View>
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: 16,
    paddingVertical: 14,
    paddingLeft: 12,
    paddingRight: 14,
    marginBottom: 12,
    gap: 12,
  },
  cardWithDecor: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: 100,
    paddingLeft: 14,
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
  cardBody: {
    flex: 1,
    minWidth: 0,
    zIndex: 1,
    paddingLeft: 8,
  },
  cardBodyCompleted: {
    paddingLeft: 14,
  },
  completedTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  completedLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  completedLabelQuiz: {
    color: colors.events.challengeQuizLabel,
  },
  completedLabelPhoto: {
    color: CHALLENGE_ACCENT_LIME,
  },
  /** Right side, vertically centered (row `alignItems: 'center'`). */
  rowChevron: {
    width: 22,
    height: 22,
    zIndex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  labelLeadIcon: {
    width: 18,
    height: 18,
  },
  challengeLabel: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
  },
  completedPoints: {
    color: CHALLENGE_ACCENT_LIME,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    fontFamily: fontFamilies.signikaRegular,
  },
  completedPointsZero: {
    color: colors.states.error,
  },
  challengeLabelQuiz: {
    color: colors.events.challengeQuizLabel,
  },
  challengeLabelPhoto: {
    color: CHALLENGE_ACCENT_LIME,
  },
  challengeTitle: {
    color: colors.neutral.primary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
  },
});
