import { EventChallengeQuizOptionsList } from './EventChallengeQuizOptionsList';
import { EventChallengeQuizQuestionCardFrame } from './EventChallengeQuizQuestionCardFrame';
import { StyleSheet, View } from 'react-native';

type Props = {
  kicker: string;
  question: string;
  answerOptions: string[];
  selectedIndex: number | null;
  onToggleOption: (index: number) => void;
};

export function EventChallengeQuizBodyView({
  kicker,
  question,
  answerOptions,
  selectedIndex,
  onToggleOption,
}: Props) {
  return (
    <View style={styles.body}>
      <EventChallengeQuizQuestionCardFrame kicker={kicker} question={question}>
        <EventChallengeQuizOptionsList
          answerOptions={answerOptions}
          selectedIndex={selectedIndex}
          onToggleOption={onToggleOption}
        />
      </EventChallengeQuizQuestionCardFrame>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {},
});
