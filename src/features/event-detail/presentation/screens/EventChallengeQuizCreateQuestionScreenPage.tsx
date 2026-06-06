import { EventChallengeQuizCreateQuestionView } from '../components/quiz/EventChallengeQuizCreateQuestionView';
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
    editingOption,
    onCloseModal,
    onAnswerPress,
    onTrash,
    onFinish,
    onSaveAnswerEdit,
    modalInitialCorrect,
    canFinish,
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
    <EventChallengeQuizCreateQuestionView
      kicker={
        isEditMode
          ? t('eventDetail.createQuizEditChallengeKicker')
          : t('eventDetail.createQuizNewChallengeKicker')
      }
      question={question.text}
      answerOptions={question.answerOptions}
      correctOptionId={question.correctOptionId}
      slotLabels={slotLabels}
      canFinish={canFinish}
      finishButtonTitle={
        isEditMode
          ? t('eventDetail.createQuizUpdateChallenge')
          : t('eventDetail.createQuizFinishChallenge')
      }
      editingOption={editingOption}
      modalInitialCorrect={modalInitialCorrect}
      onAnswerPress={onAnswerPress}
      onTrash={onTrash}
      onFinish={onFinish}
      onCloseModal={onCloseModal}
      onSaveAnswerEdit={onSaveAnswerEdit}
    />
  );
}

const styles = StyleSheet.create({
  loadingRoot: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
