export type EventChallengeQuestionSuggestionOptionApiItem = {
  id: number;
  option: string;
  position: number;
};

export type EventChallengeQuestionSuggestionApiItem = {
  id: number;
  question: string;
  options: EventChallengeQuestionSuggestionOptionApiItem[];
  created_at: string;
  updated_at: string;
};

export type EventChallengeQuestionSuggestionsResponse = {
  data: EventChallengeQuestionSuggestionApiItem[];
  status: boolean;
  errors: unknown;
  error: string | null;
};

export type EventChallengePhotoSuggestionApiItem = {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
};

export type EventChallengePhotoSuggestionsResponse = {
  data: EventChallengePhotoSuggestionApiItem[];
  status: boolean;
  errors: unknown;
  error: string | null;
};
