import { EventChallengeQuizOptionsList } from './EventChallengeQuizOptionsList';
import {
  EventChallengeQuizQuestionCardFrame,
  QUIZ_CARD,
} from './EventChallengeQuizQuestionCardFrame';
import { useTranslation } from '@/src/i18n';

type Props = {
  quiz: { number: number; question: string; options: string[] };
  selectedIndex: number | null;
  onToggleOption: (index: number) => void;
};

export function EventChallengeQuizQuestionView({ quiz, selectedIndex, onToggleOption }: Props) {
  const { t } = useTranslation();
  return (
    <EventChallengeQuizQuestionCardFrame
      kicker={t('challenges.challengeNumberLabel', { n: quiz.number })}
      kickerColor={QUIZ_CARD.kickerGuest}
      question={quiz.question}
    >
      <EventChallengeQuizOptionsList
        options={quiz.options}
        selectedIndex={selectedIndex}
        onToggleOption={onToggleOption}
      />
    </EventChallengeQuizQuestionCardFrame>
  );
}
