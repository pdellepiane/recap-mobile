import { challengeFlowBackHeaderBottom } from '../shared/EventChallengeHeaderView';
import { EventChallengeQuizOptionsList } from './EventChallengeQuizOptionsList';
import { EventChallengeQuizQuestionCardFrame } from './EventChallengeQuizQuestionCardFrame';
import { useTranslation } from '@/src/i18n';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  quiz: { number: number; question: string; options: string[] };
  selectedIndex: number | null;
  onToggleOption: (index: number) => void;
};

export function EventChallengeQuizBodyView({ quiz, selectedIndex, onToggleOption }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const headerBottom = challengeFlowBackHeaderBottom(insets.top);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <EventChallengeQuizQuestionCardFrame
        kicker={t('challenges.challengeNumberLabel', { n: quiz.number })}
        question={quiz.question}
        contentInsetTop={headerBottom}
      >
        <EventChallengeQuizOptionsList
          options={quiz.options}
          selectedIndex={selectedIndex}
          onToggleOption={onToggleOption}
        />
      </EventChallengeQuizQuestionCardFrame>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
