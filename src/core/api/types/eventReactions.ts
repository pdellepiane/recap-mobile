/** POST /api/events/:id/reactions — `body.reaction`. */
export type EventReactionKind = 'party' | 'sad' | 'laugh' | 'love';

export type EventReactionPostBody = {
  reaction: EventReactionKind;
};

export type EventReactionPostResponse = {
  status: boolean;
  errors: unknown;
  error: string | null;
};
