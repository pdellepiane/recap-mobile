import { EventChallengeQuizResultFeedbackRow } from './EventChallengeQuizResultFeedbackRow';
import { images } from '@/src/assets/images';
import { colors } from '@/src/ui';
import { FontAwesome5 } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';

type Props = {
  question: string;
  selectedLabel: string;
  correctLabel: string;
};

export function EventChallengeQuizResultWrongCard({
  question,
  selectedLabel,
  correctLabel,
}: Props) {
  return (
    <View style={[styles.resultCard, styles.resultCardWithDecor]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Image
          source={images.eventDetail.challenges.cardDecorUnion}
          style={styles.resultCardDecor}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.resultQuestion}>{question}</Text>
      <View style={styles.resultFeedbackPills}>
        <EventChallengeQuizResultFeedbackRow
          leading={<FontAwesome5 name="times" size={22} color={colors.states.error} solid />}
          label={selectedLabel}
        />
        <View style={styles.resultPillSpacer} />
        <EventChallengeQuizResultFeedbackRow
          leading={<FontAwesome5 name="check" size={20} color={colors.states.active} solid />}
          label={correctLabel}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  resultCard: {
    width: '100%',
    borderRadius: 22,
    backgroundColor: colors.background.elevated,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    marginBottom: 18,
  },
  resultCardWithDecor: { overflow: 'hidden' },
  resultCardDecor: {
    position: 'absolute',
    left: -18,
    top: -22,
    width: 220,
    height: 220,
    opacity: 0.35,
  },
  resultFeedbackPills: { alignSelf: 'stretch' },
  resultPillSpacer: { height: 12 },
  resultQuestion: {
    color: colors.neutral.primary,
    fontSize: 28,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 16,
  },
});
