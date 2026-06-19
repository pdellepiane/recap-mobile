import type { EventDetailGuestsPayload } from './eventGuestsPayload';

export type EventDetailHostItem = {
  id?: number;
  user_id?: number;
  name?: string;
  email?: string;
};

/** GET /api/events/:id — full event resource. */
export type EventDetailData = {
  id: number;
  slug: string;
  name: string;
  hosts: string | EventDetailHostItem[];
  type: string;
  type_detail: string;
  datetime: string;
  with_time: number;
  stage: string;
  city: string;
  country_id: number;
  location: string;
  cover: string;
  is_visible: number;
  is_public: number;
  user_id: number;
  timezone: string;
  /** Omitted on older responses; treat as empty buckets when missing. */
  guests?: EventDetailGuestsPayload;
  /** When omitted, UI may default until PATCH or a newer payload supplies it. */
  show_guest_list?: boolean;
  created_at: string;
  updated_at: string;
};

export type EventDetailApiResponse = {
  data: EventDetailData;
  status: boolean;
  errors: unknown;
  error: string | null;
};
