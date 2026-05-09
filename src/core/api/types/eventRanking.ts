/** Row from GET /api/events/:id/ranking. */
export type EventRankingApiItem = {
  id: number;
  name: string;
  lastname: string;
  points: number;
};

export type EventRankingListResponse = {
  data: EventRankingApiItem[];
  status: boolean;
  errors: unknown;
  error: string | null;
};
