import { EventChallengeQuizOptionRow } from './EventChallengeQuizOptionRow';
import { StyleSheet, View } from 'react-native';

type Props = {
  answerOptions: string[];
  selectedIndex: number | null;
  onToggleOption: (index: number) => void;
};

export function EventChallengeQuizOptionsList({
  answerOptions,
  selectedIndex,
  onToggleOption,
}: Props) {
  return (
    <View style={styles.options}>
      {answerOptions.map((label, idx) => (
        <EventChallengeQuizOptionRow
          key={`${String(idx)}-${label}`}
          label={label}
          selected={idx === selectedIndex}
          onPress={() => onToggleOption(idx)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: 10,
  },
});
