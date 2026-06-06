import { EventChallengeFlowScrollLayout } from '../shared/EventChallengeFlowScrollLayout';
import { EventChallengeQuizBodyView } from './EventChallengeQuizBodyView';
import { EventChallengeQuizFooterView } from './EventChallengeQuizFooterView';

type Props = {
  kicker: string;
  question: string;
  answerOptions: string[];
  selectedIndex: number | null;
  canFinish: boolean;
  isSubmitting: boolean;
  onToggleOption: (index: number) => void;
  onFinish: () => void;
};

export function EventChallengeQuizView({
  kicker,
  question,
  answerOptions,
  selectedIndex,
  canFinish,
  isSubmitting,
  onToggleOption,
  onFinish,
}: Props) {
  return (
    <EventChallengeFlowScrollLayout
      footer={
        <EventChallengeQuizFooterView
          canConfirm={canFinish}
          loading={isSubmitting}
          onConfirm={onFinish}
        />
      }
    >
      <EventChallengeQuizBodyView
        kicker={kicker}
        question={question}
        answerOptions={answerOptions}
        selectedIndex={selectedIndex}
        onToggleOption={onToggleOption}
      />
    </EventChallengeFlowScrollLayout>
  );
}
