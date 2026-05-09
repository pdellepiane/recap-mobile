import { EventChallengeQuizResultFeedbackRow } from './EventChallengeQuizResultFeedbackRow';
import { images } from '@/src/assets/images';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, StyleSheet, Text, View } from 'react-native';

type Props = {
  question: string;
  selectedLabel: string;
};

export function EventChallengeQuizResultCorrectCard({ question, selectedLabel }: Props) {
  return (
    <View style={styles.resultCard}>
      <Text style={styles.resultQuestion}>{question}</Text>
      <EventChallengeQuizResultFeedbackRow
        leading={
          <Image
            source={images.common.check}
            style={styles.correctCheckIcon}
            resizeMode="contain"
            accessibilityElementsHidden
          />
        }
        label={selectedLabel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  resultCard: {
    width: '100%',
    borderRadius: 22,
    backgroundColor: colors.background.elevated,
    paddingHorizontal: 18,
    paddingTop: 40,
    paddingBottom: 50,
    marginBottom: 18,
  },
  resultQuestion: {
    color: colors.neutral.primary,
    fontSize: 28,
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 30,
  },
  correctCheckIcon: {
    width: 18,
    height: 18,
    tintColor: colors.states.active,
  },
});
