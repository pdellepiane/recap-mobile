import type { LoginCodeLanguagePayload } from './auth';

/** Guest row nested under GET /api/home/host-events and /api/home/guest-events event payloads. */
export type HomeEventGuestItem = {
  id: number;
  name: string;
  email: string;
  full_phone: string;
  has_responded: number;
  will_attend: number;
  has_couple: number;
  response_date: string;
  language_id: number;
  language: LoginCodeLanguagePayload;
  created_at: string;
  updated_at: string;
};

export type HomeEventHostItem = {
  id: number;
  user_id?: number;
  name: string;
  email: string;
  full_phone: string;
};

/** Single event row from GET /api/home/host-events or /api/home/guest-events. */
export type HomeEventItem = {
  id: number;
  slug: string;
  name: string;
  type: string;
  datetime: string;
  with_time: number;
  stage: string;
  city: string;
  location: string;
  /** Hero/cover image URL (same role as home banner `cover`). */
  cover?: string | null;
  guests: HomeEventGuestItem[];
  hosts: HomeEventHostItem[];
  timezone: string;
  created_at: string;
  updated_at: string;
};

export type HomeEventsListResponse = {
  data: HomeEventItem[];
  status: boolean;
  errors: unknown;
  error: string | null;
};
