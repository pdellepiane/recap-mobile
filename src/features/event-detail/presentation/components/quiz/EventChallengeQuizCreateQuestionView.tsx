import { EventChallengeCreateFooterView } from '../shared/EventChallengeCreateFooterView';
import { EventChallengeFlowScrollLayout } from '../shared/EventChallengeFlowScrollLayout';
import type { QuizCreateQuestionOption } from '../../hooks/useEventChallengeQuizCreateScreen';
import { EventChallengeQuizCreateAnswerEditModal } from './EventChallengeQuizCreateAnswerEditModal';
import { EventChallengeQuizCreateBodyView } from './EventChallengeQuizCreateBodyView';

type Props = {
  kicker: string;
  question: string;
  answerOptions: QuizCreateQuestionOption[];
  correctOptionId: string | null;
  slotLabels: string[];
  canFinish: boolean;
  finishButtonTitle: string;
  editingOption: QuizCreateQuestionOption | null;
  modalInitialCorrect: boolean;
  onAnswerPress: (option: QuizCreateQuestionOption) => void;
  onTrash?: () => void;
  onFinish: () => void;
  onCloseModal: () => void;
  onSaveAnswerEdit: (text: string, isCorrect: boolean) => void;
};

export function EventChallengeQuizCreateQuestionView({
  kicker,
  question,
  answerOptions,
  correctOptionId,
  slotLabels,
  canFinish,
  finishButtonTitle,
  editingOption,
  modalInitialCorrect,
  onAnswerPress,
  onTrash,
  onFinish,
  onCloseModal,
  onSaveAnswerEdit,
}: Props) {
  return (
    <>
      <EventChallengeFlowScrollLayout
        modalPresentation
        onTrash={onTrash}
        footer={
          <EventChallengeCreateFooterView
            canConfirm={canFinish}
            finishButtonTitle={finishButtonTitle}
            onConfirm={onFinish}
          />
        }
      >
        <EventChallengeQuizCreateBodyView
          kicker={kicker}
          question={question}
          answerOptions={answerOptions}
          correctOptionId={correctOptionId}
          slotLabels={slotLabels}
          onAnswerPress={onAnswerPress}
        />
      </EventChallengeFlowScrollLayout>

      {editingOption ? (
        <EventChallengeQuizCreateAnswerEditModal
          key={editingOption.id}
          visible
          initialText={editingOption.text}
          initialCorrect={modalInitialCorrect}
          onClose={onCloseModal}
          onSave={onSaveAnswerEdit}
        />
      ) : null}
    </>
  );
}
