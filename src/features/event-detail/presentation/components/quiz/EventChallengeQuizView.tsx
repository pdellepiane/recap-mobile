import { EventChallengeHeaderView } from '../shared/EventChallengeHeaderView';
import { EventChallengeQuizBodyView } from './EventChallengeQuizBodyView';
import { EventChallengeQuizFooterView } from './EventChallengeQuizFooterView';
import { colors } from '@/src/ui';
import { StyleSheet, View } from 'react-native';

type Props = {
  quiz: { number: number; question: string; options: string[] };
  selectedIndex: number | null;
  canFinish: boolean;
  isSubmitting: boolean;
  onToggleOption: (index: number) => void;
  onFinalize: () => void;
};

export function EventChallengeQuizView({
  quiz,
  selectedIndex,
  canFinish,
  isSubmitting,
  onToggleOption,
  onFinalize,
}: Props) {
  return (
    <View style={styles.root}>
      <EventChallengeHeaderView />

      <EventChallengeQuizBodyView
        quiz={quiz}
        selectedIndex={selectedIndex}
        onToggleOption={onToggleOption}
      />

      <EventChallengeQuizFooterView
        canFinish={canFinish}
        loading={isSubmitting}
        onPress={onFinalize}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingHorizontal: 20,
  },
});
