import { normalizeChallengesFromApi, parseChallengeAnswerEarnedPoints } from '../eventChallengesMap';
import { seedEventChallengeQuizzesFromApi } from '../eventChallengesQuizSeed';
import { mapEventDetailDataToDomain, mapHomeEventApiItemToDomain } from '../eventDomainMap';
import { mapEventMediaApiToAlbumPhotos, mapEventMediaApiToStorySlides, normalizeMediaLikesCount } from '../eventMediaMap';
import { buildEventMediaFormData } from '../eventMediaUpload';
import { mapRankingApiItemsToRows } from '../eventRankingMap';
import { getCachedHomeEvent } from '../homeEventCache';
import { eventPaths, homePaths } from '@/src/core/api/paths';
import type {
  EventChallengeCreateResponse,
  EventChallengePostBody,
  EventChallengeAnswerPostBody,
  EventChallengeAnswerPostResponse,
  EventChallengesListResponse,
  EventChallengesPendingResponse,
  EventChallengePhotoSuggestionsResponse,
  EventChallengeQuestionSuggestionsResponse,
  EventDetailApiResponse,
  EventMediaLikeResponse,
  EventMediaListResponse,
  EventMediaPostResponse,
  EventMediaUploadParams,
  EventRankingListResponse,
  EventReactionKind,
  EventReactionPostResponse,
  EventSettingsPatchBody,
  EventSettingsPatchResponse,
  HomeBannerItem,
  HomeBannersListResponse,
  HomeEventsListResponse,
} from '@/src/core/api/types';
import type { FetchOpts } from '@/src/core/http/FetchOpts';
import type { HttpClient } from '@/src/core/http/HttpClient';
import { isAbortError } from '@/src/core/http/isAbortError';
import type { Event as DomainEvent } from '@/src/domain/entities';
import type { AlbumPhoto } from '@/src/features/event-detail/data/eventAlbum';
import type { EventStorySlide } from '@/src/features/event-detail/data/eventStories';
import {
  cacheEventChallengesFromRemote,
  getEventChallenges,
  type EventChallenge,
} from '@/src/features/event-detail/data/eventChallenges';
import { emitEventChallengesListRefresh } from '@/src/features/event-detail/data/eventChallengesListRefresh';
import type { RankingRow } from '@/src/features/event-detail/data/eventRanking';

function parseHomeEventsBody(res: HomeEventsListResponse): DomainEvent[] {
  if (!res.status || !Array.isArray(res.data)) {
    return [];
  }
  return res.data.map(mapHomeEventApiItemToDomain);
}

function parseHomeBannersBody(res: HomeBannersListResponse): HomeBannerItem[] {
  if (!res.status || !Array.isArray(res.data)) {
    return [];
  }
  return res.data;
}

/**
 * Events: home lists and detail use {@link FetchHttpClient} against `EXPO_PUBLIC_API_BASE_URL`.
 * Detail merges the home cache snapshot with GET /api/events/:id.
 */
function bearer(opts?: FetchOpts): FetchOpts {
  return { auth: 'bearer', ...opts };
}

export class EventRepository {
  constructor(private readonly api: HttpClient) {}

  /** Snapshot from the last home feed fetch — instant detail paint before remote returns. */
  getLocalEventById(eventId: string): DomainEvent | null {
    const cached = getCachedHomeEvent(eventId);
    return cached ?? null;
  }

  /** PATCH /api/events/:id/settings — e.g. public guest list visibility. */
  async patchEventSettings(
    eventId: string,
    body: EventSettingsPatchBody,
    opts?: FetchOpts,
  ): Promise<{ show_guest_list: boolean } | null> {
    try {
      const res = await this.api.patch<EventSettingsPatchResponse>(
        eventPaths.settings(eventId),
        body,
        bearer(opts),
      );
      if (!res.status || !res.data || typeof res.data.show_guest_list !== 'boolean') {
        return null;
      }
      return res.data;
    } catch (e) {
      if (isAbortError(e)) {
        throw e;
      }
      return null;
    }
  }

  /** GET /api/events/:id. */
  async fetchRemoteEventDetail(eventId: string, opts?: FetchOpts): Promise<DomainEvent | null> {
    try {
      const res = await this.api.get<EventDetailApiResponse>(eventPaths.detail(eventId), bearer(opts));
      if (!res.status || !res.data) {
        return null;
      }
      return mapEventDetailDataToDomain(res.data);
    } catch (e) {
      if (isAbortError(e)) {
        throw e;
      }
      return null;
    }
  }

  /** POST /api/events/:id/reactions. */
  async postEventReaction(eventId: string, reaction: EventReactionKind): Promise<boolean> {
    try {
      const res = await this.api.post<EventReactionPostResponse>(
        eventPaths.reactions(eventId),
        { reaction },
        { auth: 'bearer' },
      );
      return Boolean(res.status);
    } catch {
      return false;
    }
  }

  /** GET /api/events/:id/ranking. */
  async fetchEventRankingRemote(eventId: string, opts?: FetchOpts): Promise<RankingRow[] | null> {
    try {
      const res = await this.api.get<EventRankingListResponse>(
        eventPaths.ranking(eventId),
        bearer(opts),
      );
      if (!res.status || !Array.isArray(res.data)) {
        return null;
      }
      return mapRankingApiItemsToRows(res.data);
    } catch (e) {
      if (isAbortError(e)) {
        throw e;
      }
      return null;
    }
  }

  /** GET /api/events/:id/media — album grid. */
  async fetchEventMedia(eventId: string, opts?: FetchOpts): Promise<AlbumPhoto[]> {
    try {
      const res = await this.api.get<EventMediaListResponse>(eventPaths.media(eventId), bearer(opts));
      if (!res.status || !Array.isArray(res.data)) {
        return [];
      }
      return mapEventMediaApiToAlbumPhotos(res.data);
    } catch (e) {
      if (isAbortError(e)) {
        throw e;
      }
      return [];
    }
  }

  /** GET /api/events/:id/media — story slides (photos, oldest first). */
  async fetchEventStorySlides(eventId: string, opts?: FetchOpts): Promise<EventStorySlide[]> {
    try {
      const res = await this.api.get<EventMediaListResponse>(eventPaths.media(eventId), bearer(opts));
      if (!res.status || !Array.isArray(res.data)) {
        return [];
      }
      return mapEventMediaApiToStorySlides(res.data);
    } catch (e) {
      if (isAbortError(e)) {
        throw e;
      }
      return [];
    }
  }

  /** POST /api/events/:id/media/:mediaId/likes */
  async postEventMediaLike(
    eventId: string,
    mediaId: string,
  ): Promise<{ liked: boolean; likes_count: number } | null> {
    try {
      const res = await this.api.post<EventMediaLikeResponse>(
        eventPaths.mediaLike(eventId, mediaId),
        {},
        { auth: 'bearer' },
      );
      if (!res.status || !res.data || typeof res.data.liked !== 'boolean') {
        return null;
      }
      return {
        liked: res.data.liked,
        likes_count: normalizeMediaLikesCount(res.data.likes_count),
      };
    } catch {
      return null;
    }
  }

  /** POST /api/events/:id/media (multipart/form-data). */
  async uploadEventMedia(
    eventId: string,
    params: EventMediaUploadParams,
  ): Promise<{ ok: boolean; path?: string }> {
    try {
      const formData = buildEventMediaFormData(params);
      const res = await this.api.postFormData<EventMediaPostResponse>(
        eventPaths.media(eventId),
        formData,
        { auth: 'bearer' },
      );
      const path = res.data?.path?.trim();
      return { ok: Boolean(res.status), path: path || undefined };
    } catch {
      return { ok: false };
    }
  }

  /** POST /api/events/:id/challenges/:challengeId/answers — guest question or photo answer. */
  async submitEventChallengeAnswer(
    eventId: string,
    challengeId: string,
    body: EventChallengeAnswerPostBody,
  ): Promise<{ points: number } | null> {
    try {
      const res = await this.api.post<EventChallengeAnswerPostResponse>(
        eventPaths.challengeAnswers(eventId, challengeId),
        body,
        { auth: 'bearer' },
      );
      if (!res.status) {
        return null;
      }
      await this.fetchEventChallenges(eventId);
      emitEventChallengesListRefresh(eventId);
      return { points: parseChallengeAnswerEarnedPoints(res.data) };
    } catch {
      return null;
    }
  }

  /** GET /api/events/:id/challenges/pending — `has_pending` for tab dot during live window. */
  async fetchEventChallengesPending(eventId: string, opts?: FetchOpts): Promise<boolean> {
    try {
      const res = await this.api.get<EventChallengesPendingResponse>(
        eventPaths.challengesPending(eventId),
        bearer(opts),
      );
      if (!res.status || !res.data || typeof res.data.has_pending !== 'boolean') {
        return false;
      }
      return res.data.has_pending;
    } catch (e) {
      if (isAbortError(e)) {
        throw e;
      }
      return false;
    }
  }

  /** GET /api/events/:id/challenges. */
  async fetchEventChallenges(eventId: string, opts?: FetchOpts): Promise<EventChallenge[]> {
    try {
      const res = await this.api.get<EventChallengesListResponse>(
        eventPaths.challenges(eventId),
        bearer(opts),
      );
      if (!res.status || !Array.isArray(res.data)) {
        return getEventChallenges(eventId);
      }
      seedEventChallengeQuizzesFromApi(res.data);
      const mapped = normalizeChallengesFromApi(res.data);
      cacheEventChallengesFromRemote(eventId, mapped);
      return mapped;
    } catch (e) {
      if (isAbortError(e)) {
        throw e;
      }
      return getEventChallenges(eventId);
    }
  }

  /**
   * POST /api/events/:id/challenges — single challenge (`type`: `question` | `picture`, optional `options` + `correct_option_index`).
   * Used by quiz create, photo create, and any other host challenge flows.
   */
  async createEventChallenge(eventId: string, body: EventChallengePostBody): Promise<boolean> {
    try {
      const res = await this.api.post<EventChallengeCreateResponse>(
        eventPaths.challenges(eventId),
        body,
        { auth: 'bearer' },
      );
      const ok = Boolean(res.status && res.data);
      if (ok) {
        await this.fetchEventChallenges(eventId);
        emitEventChallengesListRefresh(eventId);
      }
      return ok;
    } catch {
      return false;
    }
  }

  /**
   * Same endpoint as {@link createEventChallenge}, in order. Stops on first failure;
   * each successful POST still refreshes the cached challenges list.
   */
  async createEventChallengesSequential(
    eventId: string,
    bodies: EventChallengePostBody[],
  ): Promise<boolean> {
    for (const body of bodies) {
      const ok = await this.createEventChallenge(eventId, body);
      if (!ok) {
        return false;
      }
    }
    return true;
  }

  /** GET /api/event-challenge-suggestions/questions. */
  async fetchEventChallengeQuestionSuggestions(
    opts?: FetchOpts,
  ): Promise<{ id: string; question: string }[]> {
    try {
      const res = await this.api.get<EventChallengeQuestionSuggestionsResponse>(
        eventPaths.challengeQuestionSuggestions,
        bearer(opts),
      );
      if (!res.status || !Array.isArray(res.data)) {
        return [];
      }
      return res.data
        .map((item) => ({
          id: String(item.id),
          question: item.question?.trim() ?? '',
        }))
        .filter((item) => item.question.length > 0);
    } catch (e) {
      if (isAbortError(e)) {
        throw e;
      }
      return [];
    }
  }

  /** GET /api/event-challenge-suggestions/photos. */
  async fetchEventChallengePhotoSuggestions(
    opts?: FetchOpts,
  ): Promise<{ id: string; title: string }[]> {
    try {
      const res = await this.api.get<EventChallengePhotoSuggestionsResponse>(
        eventPaths.challengePhotoSuggestions,
        bearer(opts),
      );
      if (!res.status || !Array.isArray(res.data)) {
        return [];
      }
      return res.data
        .map((item) => ({
          id: String(item.id),
          title: item.title?.trim() ?? '',
        }))
        .filter((item) => item.title.length > 0);
    } catch (e) {
      if (isAbortError(e)) {
        throw e;
      }
      return [];
    }
  }

  /** GET /api/home/host-events — “Mis eventos” (hosted). */
  async getHostEvents(opts?: FetchOpts): Promise<DomainEvent[]> {
    const res = await this.api.get<HomeEventsListResponse>(homePaths.hostEvents, bearer(opts));
    return parseHomeEventsBody(res);
  }

  /** GET /api/home/guest-events — “Planes” (guest). */
  async getGuestEvents(opts?: FetchOpts): Promise<DomainEvent[]> {
    const res = await this.api.get<HomeEventsListResponse>(homePaths.guestEvents, bearer(opts));
    return parseHomeEventsBody(res);
  }

  /** GET /api/home/banners — top slider (host/guest events, deduped; includes `no_event` fallback). */
  async getHomeBanners(opts?: FetchOpts): Promise<HomeBannerItem[]> {
    const res = await this.api.get<HomeBannersListResponse>(homePaths.banners, bearer(opts));
    return parseHomeBannersBody(res);
  }
}
