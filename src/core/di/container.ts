import { MockHttpClient } from '@/src/core/http/MockHttpClient';
import { AuthRepository } from '@/src/features/auth/data/repositories/AuthRepository';
import { EventRepository } from '@/src/features/events/data/repositories/EventRepository';
import { ProfileRepository } from '@/src/features/profile/data/repositories/ProfileRepository';

const httpClient = new MockHttpClient();

export const authRepository = new AuthRepository(httpClient);
export const eventRepository = new EventRepository(httpClient);
export const profileRepository = new ProfileRepository(httpClient);
