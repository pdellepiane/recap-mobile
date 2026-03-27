export type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  /** Cover image for home cards and hero (optional). */
  coverImageUrl?: string;
};
