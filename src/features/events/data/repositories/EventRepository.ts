import { cacheEventChallengeApiItems } from '../eventChallengeApiItemCache';
import {
  normalizeChallengesFromApi,
  parseChallengeAnswerEarnedPoints,
} from '../eventChallengesMap';
import { seedEventChallengeQuizzesFromApi } from '../eventChallengesQuizSeed';
import { mapEventDetailDataToDomain, mapHomeEventApiItemToDomain } from '../eventDomainMap';
import {
  mapEventMediaApiToAlbumPhotos,
  mapEventMediaApiToStorySlides,
  normalizeMediaLikesCount,
} from '../eventMediaMap';
import { buildEventMediaFormData } from '../eventMediaUpload';
import { mapRankingApiItemsToRows } from '../eventRankingMap';
import { getCachedHomeEvent } from '../homeEventCache';
import { prepareEventMediaUploadFile } from '../prepareEventMediaUploadFile';
import {
  questionSuggestionFromApiItem,
  type QuestionSuggestion,
} from '../questionSuggestionFromApi';
import { eventPaths, homePaths } from '@/src/core/api/paths';
import type {
  EventChallengeAnswerPostBody,
  EventChallengeAnswerPostResponse,
  EventChallengeCreateResponse,
  EventChallengePhotoSuggestionsResponse,
  EventChallengePostBody,
  EventChallengePutBody,
  EventChallengeQuestionSuggestionsResponse,
  EventChallengeUpdateResponse,
  EventChallengesListResponse,
  EventChallengesPendingResponse,
  EventDetailApiResponse,
  EventMediaApiItem,
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
import { isApiRequestError } from '@/src/core/http/ApiRequestError';
import type { FetchOpts } from '@/src/core/http/FetchOpts';
import type { HttpClient } from '@/src/core/http/HttpClient';
import { isAbortError } from '@/src/core/http/isAbortError';
import type { Event as DomainEvent } from '@/src/domain/entities';
import type { AlbumPhoto } from '@/src/features/event-detail/data/eventAlbum';
import {
  cacheEventChallengesFromRemote,
  getEventChallenges,
  type EventChallenge,
} from '@/src/features/event-detail/data/eventChallenges';
import { emitEventChallengesListRefresh } from '@/src/features/event-detail/data/eventChallengesListRefresh';
import type { RankingRow } from '@/src/features/event-detail/data/eventRanking';
import type { EventStorySlide } from '@/src/features/event-detail/data/eventStories';

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

export type FetchEventMediaParams = {
  page?: number;
};

export type FetchEventMediaResult = {
  items: AlbumPhoto[];
  hasMore: boolean;
  currentPage: number;
};

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
      const res = await this.api.get<EventDetailApiResponse>(
        eventPaths.detail(eventId),
        bearer(opts),
      );
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

  /** GET /api/events/:id/media — album grid (paginated). */
  async fetchEventMedia(
    eventId: string,
    params: FetchEventMediaParams = {},
    opts?: FetchOpts,
  ): Promise<FetchEventMediaResult> {
    try {
      const search = new URLSearchParams();
      if (params.page != null && params.page > 0) {
        search.set('page', String(params.page));
      }
      const query = search.toString();
      const path = query ? `${eventPaths.media(eventId)}?${query}` : eventPaths.media(eventId);

      const res = await this.api.get<EventMediaListResponse>(path, bearer(opts));
      if (!res.status || !res.data || !Array.isArray(res.data.items)) {
        return { items: [], hasMore: false, currentPage: params.page ?? 1 };
      }

      return {
        items: mapEventMediaApiToAlbumPhotos(res.data.items),
        hasMore: Boolean(res.data.has_more),
        currentPage: res.data.current_page ?? params.page ?? 1,
      };
    } catch (e) {
      if (isAbortError(e)) {
        throw e;
      }
      return { items: [], hasMore: false, currentPage: params.page ?? 1 };
    }
  }

  /** Finds one album photo by media id (paginates until found). */
  async fetchEventMediaById(
    eventId: string,
    mediaId: string,
    opts?: FetchOpts,
  ): Promise<AlbumPhoto | null> {
    try {
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const result = await this.fetchEventMedia(eventId, { page }, opts);
        const found = result.items.find((item) => item.id === mediaId);
        if (found) {
          return found;
        }
        hasMore = result.hasMore;
        page += 1;
      }

      return null;
    } catch (e) {
      if (isAbortError(e)) {
        throw e;
      }
      return null;
    }
  }

  /** GET /api/events/:id/media — story slides (photos, oldest first; fetches all pages). */
  async fetchEventStorySlides(eventId: string, opts?: FetchOpts): Promise<EventStorySlide[]> {
    try {
      const allItems: EventMediaApiItem[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const search = new URLSearchParams({ page: String(page) });
        const path = `${eventPaths.media(eventId)}?${search.toString()}`;
        const res = await this.api.get<EventMediaListResponse>(path, bearer(opts));
        if (!res.status || !res.data || !Array.isArray(res.data.items)) {
          break;
        }
        allItems.push(...res.data.items);
        hasMore = Boolean(res.data.has_more);
        page += 1;
      }

      return mapEventMediaApiToStorySlides(allItems);
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
      const prepared = await prepareEventMediaUploadFile(params.fileUri);
      const formData = buildEventMediaFormData({
        ...params,
        fileUri: prepared.uri,
        mimeType: prepared.mimeType,
        fileName: prepared.fileName,
      });
      const res = await this.api.postFormData<EventMediaPostResponse>(
        eventPaths.media(eventId),
        formData,
        { auth: 'bearer' },
      );
      const path = res.data?.path?.trim();
      return { ok: Boolean(res.status), path: path || undefined };
    } catch (e) {
      if (isApiRequestError(e)) {
        throw e;
      }
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
    } catch (e) {
      if (isApiRequestError(e)) {
        throw e;
      }
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
      cacheEventChallengeApiItems(res.data);
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

  /** PUT /api/events/:id/challenges/:challengeId — update an existing challenge. */
  async updateEventChallenge(
    eventId: string,
    challengeId: string,
    body: EventChallengePutBody,
  ): Promise<boolean> {
    try {
      console.log('body', body);
      console.log(
        'eventPaths.challenge(eventId, challengeId)',
        eventPaths.challenge(eventId, challengeId),
      );
      const res = await this.api.put<EventChallengeUpdateResponse>(
        eventPaths.challenge(eventId, challengeId),
        body,
        { auth: 'bearer' },
      );
      const ok = Boolean(res.status && res.data);
      if (ok) {
        await this.fetchEventChallenges(eventId);
        emitEventChallengesListRefresh(eventId);
      }
      return ok;
    } catch (e) {
      console.error(e);
      if (isAbortError(e)) {
        throw e;
      }
      if (isApiRequestError(e)) {
        throw e;
      }
      return false;
    }
  }

  /** GET /api/event-challenge-suggestions/questions. */
  async fetchEventChallengeQuestionSuggestions(opts?: FetchOpts): Promise<QuestionSuggestion[]> {
    try {
      const res = await this.api.get<EventChallengeQuestionSuggestionsResponse>(
        eventPaths.challengeQuestionSuggestions,
        bearer(opts),
      );
      if (!res.status || !Array.isArray(res.data)) {
        return [];
      }
      return res.data
        .map(questionSuggestionFromApiItem)
        .filter((item): item is QuestionSuggestion => item != null);
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
