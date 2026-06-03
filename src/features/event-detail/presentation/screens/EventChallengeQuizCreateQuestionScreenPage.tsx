import { EventChallengeQuizCreateAnswerEditModal } from '../components/quiz/EventChallengeQuizCreateAnswerEditModal';
import { EventChallengeQuizCreateAnswerInputRow } from '../components/quiz/EventChallengeQuizCreateAnswerInputRow';
import { EventChallengeQuizQuestionCardFrame } from '../components/quiz/EventChallengeQuizQuestionCardFrame';
import { EventChallengeCreateHeaderView } from '../components/shared/EventChallengeCreateHeaderView';
import { EventChallengeCreatePreviewFooter } from '../components/shared/EventChallengeCreatePreviewFooter';
import { useEventChallengeQuizCreateQuestionScreen } from '../hooks/useEventChallengeQuizCreateQuestionScreen';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

type Props = {
  eventId: string;
  questionId: string;
  remoteChallengeId?: string;
};

/** Configure answer options for one draft quiz question (`challenge-quiz-create/question`). */
export function EventChallengeQuizCreateQuestionScreenPage({
  eventId: _eventId,
  questionId,
  remoteChallengeId,
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
    isEditMode,
    editHydrating,
    isSubmitting,
  } = useEventChallengeQuizCreateQuestionScreen({ questionId, remoteChallengeId });

  if (editHydrating || isSubmitting) {
    return (
      <View style={styles.loadingRoot}>
        <ActivityIndicator size="large" color={colors.states.active} />
      </View>
    );
  }

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
      <EventChallengeCreateHeaderView
        onBack={goBack}
        onTrash={onTrash}
        backAccessibilityLabel={t('common.back')}
        trashAccessibilityLabel={t('eventDetail.createQuizDeleteQuestionA11y')}
      />

      <View style={styles.body}>
        <EventChallengeQuizQuestionCardFrame
          kicker={
            isEditMode
              ? t('eventDetail.createQuizEditChallengeKicker')
              : t('eventDetail.createQuizNewChallengeKicker')
          }
          question={question.text}
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
        finishButtonTitle={
          isEditMode
            ? t('eventDetail.createQuizUpdateChallenge')
            : t('eventDetail.createQuizFinishChallenge')
        }
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
  loadingRoot: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  root: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingHorizontal: 20,
  },
  body: {
    flex: 1,
  },
  slotList: {
    marginTop: 4,
  },
});
