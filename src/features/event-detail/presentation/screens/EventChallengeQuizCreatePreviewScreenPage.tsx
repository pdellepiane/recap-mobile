import { EventChallengeCreatePreviewFooter } from '../components/EventChallengeCreatePreviewFooter';
import { EventChallengeCreatePreviewHeader } from '../components/EventChallengeCreatePreviewHeader';
import { EventChallengeQuizCreateAnswerEditModal } from '../components/EventChallengeQuizCreateAnswerEditModal';
import { EventChallengeQuizCreateAnswerInputRow } from '../components/EventChallengeQuizCreateAnswerInputRow';
import {
  EventChallengeQuizQuestionCardFrame,
  QUIZ_CARD,
} from '../components/EventChallengeQuizQuestionCardFrame';
import { useEventChallengeQuizCreatePreviewScreen } from '../hooks/useEventChallengeQuizCreatePreviewScreen';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { StyleSheet, View } from 'react-native';

type Props = {
  eventId: string;
  questionId: string;
};

export function EventChallengeQuizCreatePreviewScreenPage({
  eventId: _eventId,
  questionId,
}: Props) {
  const { t } = useTranslation();
  const {
    question,
    goBack,
    editingOption,
    openSlot,
    closeModal,
    onTrash,
    onFinish,
    saveAnswerEdit,
    modalInitialCorrect,
  } = useEventChallengeQuizCreatePreviewScreen({ questionId });

  if (!question) {
    return null;
  }

  const slotLabels = [
    t('eventDetail.createQuizAnswerPlaceholderRequired'),
    t('eventDetail.createQuizAnswerPlaceholderRequired'),
    t('eventDetail.createQuizAnswerPlaceholderOptional'),
    t('eventDetail.createQuizAnswerPlaceholderOptional'),
  ];

  return (
    <View style={styles.root}>
      <EventChallengeCreatePreviewHeader
        onBack={goBack}
        onTrash={onTrash}
        backAccessibilityLabel={t('common.back')}
        trashAccessibilityLabel={t('eventDetail.createQuizDeleteQuestionA11y')}
      />

      <View style={styles.body}>
        <EventChallengeQuizQuestionCardFrame
          kicker={t('eventDetail.createQuizNewChallengeKicker')}
          kickerColor={QUIZ_CARD.kickerGuest}
          question={question.text}
          compact
        >
          <View style={styles.slotList}>
            {question.answerOptions.map((opt, index) => (
              <EventChallengeQuizCreateAnswerInputRow
                key={opt.id}
                label={slotLabels[index] ?? slotLabels[0]}
                value={opt.text}
                isCorrect={Boolean(
                  question.correctOptionId === opt.id && opt.text.trim().length > 0,
                )}
                onPress={() => openSlot(opt)}
              />
            ))}
          </View>
        </EventChallengeQuizQuestionCardFrame>
      </View>

      <EventChallengeCreatePreviewFooter
        onConfirm={onFinish}
        finishButtonTitle={t('eventDetail.createQuizFinishChallenge')}
      />

      {editingOption ? (
        <EventChallengeQuizCreateAnswerEditModal
          key={editingOption.id}
          visible
          initialText={editingOption.text}
          initialCorrect={modalInitialCorrect}
          onClose={closeModal}
          onSave={saveAnswerEdit}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  body: {
    flex: 1,
  },
  slotList: {
    marginTop: 4,
  },
});
