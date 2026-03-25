export type Participant = {
  id: string;
  userId: string;
  eventId: string;
  status: 'going' | 'interested';
};
