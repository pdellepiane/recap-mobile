import type {
  EventChallengeQuestionSuggestionApiItem,
  EventChallengeQuestionSuggestionOptionApiItem,
} from '@/src/core/api/types/eventChallengeSuggestions';

export type QuestionSuggestionOption = {
  id: string;
  option: string;
  position: number;
};

export type QuestionSuggestion = {
  id: string;
  question: string;
  options: QuestionSuggestionOption[];
};

function mapSuggestionOption(
  item: EventChallengeQuestionSuggestionOptionApiItem,
): QuestionSuggestionOption | null {
  const option = item.option?.trim() ?? '';
  if (!option) {
    return null;
  }
  return {
    id: String(item.id),
    option,
    position: item.position,
  };
}

function mapSuggestionOptions(
  options: EventChallengeQuestionSuggestionApiItem['options'],
): QuestionSuggestionOption[] {
  if (!Array.isArray(options)) {
    return [];
  }
  return options
    .map(mapSuggestionOption)
    .filter((item): item is QuestionSuggestionOption => item != null)
    .sort((a, b) => a.position - b.position);
}

export function questionSuggestionFromApiItem(
  item: EventChallengeQuestionSuggestionApiItem,
): QuestionSuggestion | null {
  const question = item.question?.trim() ?? '';
  if (!question) {
    return null;
  }
  return {
    id: String(item.id),
    question,
    options: mapSuggestionOptions(item.options),
  };
}
