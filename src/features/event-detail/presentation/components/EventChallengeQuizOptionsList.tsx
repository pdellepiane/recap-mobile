import { StyleSheet, View } from 'react-native';
import { EventChallengeQuizOptionRow } from './EventChallengeQuizOptionRow';

type Props = {
  options: string[];
  selectedIndex: number | null;
  onToggleOption: (index: number) => void;
};

export function EventChallengeQuizOptionsList({ options, selectedIndex, onToggleOption }: Props) {
  return (
    <View style={styles.options}>
      {options.map((label, idx) => (
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
