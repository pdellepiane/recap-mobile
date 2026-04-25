import type { EventChallenge } from '../../data/eventChallenges';
import { EventChallengeCardCompletedRow } from './EventChallengeCardCompletedRow';
import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, StyleSheet, Text, View } from 'react-native';

const CHALLENGE_ACCENT_LIME = colors.states.active;

function titleOneLine(title: string) {
  return title.replace(/\s*\n+\s*/g, ' ').trim();
}

function cardPromptLine(challenge: EventChallenge) {
  const q = challenge.question?.trim();
  if (q) {
    return titleOneLine(q);
  }
  return titleOneLine(challenge.title);
}

type Props = {
  challenge: EventChallenge;
  isQuiz: boolean;
  isCompleted: boolean;
  pointsShown: number;
  zeroPoints: boolean;
};

export function EventChallengeCardBody({
  challenge,
  isQuiz,
  isCompleted,
  pointsShown,
  zeroPoints,
}: Props) {
  const { t } = useTranslation();
  const responsesLabel =
    challenge.responsesCount != null
      ? t('challenges.responseCount', { count: challenge.responsesCount })
      : null;

  return (
    <View style={[styles.body, isCompleted && styles.bodyCompleted]}>
      {isCompleted ? (
        <EventChallengeCardCompletedRow
          isQuiz={isQuiz}
          pointsShown={pointsShown}
          zeroPoints={zeroPoints}
        />
      ) : (
        <View style={styles.topRow}>
          <Image
            source={
              isQuiz
                ? images.eventDetail.challenges.listQuizLabel
                : images.eventDetail.challenges.photoLabelIcon
            }
            style={styles.iconInner}
            resizeMode="contain"
            accessibilityElementsHidden
          />
          <View style={styles.textCol}>
            <View style={styles.headerLine}>
              <Text
                style={[styles.retoPrefix, isQuiz ? styles.retoPrefixQuiz : styles.retoPrefixPhoto]}
              >
                {t('challenges.challengeNumberWithColon', { n: challenge.number })}
              </Text>
              {responsesLabel != null ? (
                <Text style={styles.respuestasCount}> {responsesLabel}</Text>
              ) : null}
            </View>
            <Text style={styles.promptText} numberOfLines={4} ellipsizeMode="tail">
              {cardPromptLine(challenge)}
            </Text>
          </View>
        </View>
      )}
      {isCompleted ? (
        <Text style={styles.promptText} numberOfLines={2} ellipsizeMode="tail">
          {cardPromptLine(challenge)}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    minWidth: 0,
    zIndex: 1,
    paddingLeft: 0,
  },
  bodyCompleted: {
    paddingLeft: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleQuiz: {
    backgroundColor: 'rgba(196, 181, 253, 0.22)',
  },
  iconCirclePhoto: {
    backgroundColor: 'rgba(169, 224, 36, 0.22)',
  },
  iconInner: {
    width: 20,
    height: 20,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  headerLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 4,
  },
  retoPrefix: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
  },
  retoPrefixQuiz: {
    color: colors.events.challengeQuizLabel,
  },
  retoPrefixPhoto: {
    color: CHALLENGE_ACCENT_LIME,
  },
  respuestasCount: {
    color: colors.neutral.primary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
  },
  promptText: {
    color: colors.neutral.primary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
  },
});
