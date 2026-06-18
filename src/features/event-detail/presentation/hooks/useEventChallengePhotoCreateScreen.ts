import type { EventChallengePostBody } from '@/src/core/api/types';
import { eventRepository } from '@/src/core/di/container';
import { useAbortController } from '@/src/core/hooks/useAbortController';
import { isAbortError } from '@/src/core/http/isAbortError';
import {
  photoDraftFromRemoteChallenge,
  resolveEditRemotePhotoChallengeId,
} from '@/src/features/event-detail/data/eventChallengePhotoEdit';
import { getCachedEventChallengeApiItem } from '@/src/features/events/data/eventChallengeApiItemCache';
import {
  normalizeChallengePromptText,
  usedChallengePromptKeySet,
} from '@/src/features/events/data/eventChallengesMap';
import { useTranslation } from '@/src/i18n';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { showShortUserMessage, showSuccessToast, showSuccessToastAfterNavigation } from '@/src/ui';
import { useFocusEffect } from '@react-navigation/native';
import { useGlobalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard } from 'react-native';

type Params = {
  eventId: string;
  editRemoteChallengeId?: string;
};

type PhotoEditMeta = {
  remoteChallengeId: string;
  position: number;
  points: number;
  isActive: boolean;
};

export type PhotoCreateChallengeSuggestion = {
  id: string;
  title: string;
};

export type PhotoCreateAddedChallenge = {
  id: string;
  title: string;
  consumedSuggestion?: PhotoCreateChallengeSuggestion;
  remoteChallengeId?: string;
};

function firstRouteParam(v: string | string[] | undefined): string | undefined {
  if (v === undefined) {
    return undefined;
  }
  return Array.isArray(v) ? v[0] : v;
}

function newChallengeId(): string {
  return `photo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function buildAddedChallenge(
  title: string,
  consumedSuggestion?: PhotoCreateChallengeSuggestion,
): PhotoCreateAddedChallenge {
  return {
    id: newChallengeId(),
    title: title.trim(),
    ...(consumedSuggestion ? { consumedSuggestion } : {}),
  };
}

function buildPhotoChallengeBody(
  challenge: PhotoCreateAddedChallenge,
  position: number,
  overrides?: { points?: number; is_active?: boolean },
): EventChallengePostBody | null {
  const title = challenge.title.trim();
  if (!title) {
    return null;
  }
  return {
    type: 'picture',
    title,
    question: title,
    points: overrides?.points ?? 5,
    position,
    is_active: overrides?.is_active ?? true,
  };
}

export function useEventChallengePhotoCreateScreen({ eventId, editRemoteChallengeId }: Params) {
  const { t } = useTranslation();
  const { goBack } = useCoordinator();
  const { beginRequest, endRequest, abortAll } = useAbortController();
  const routeParams = useGlobalSearchParams<{
    remoteChallengeId?: string | string[];
    challengeId?: string | string[];
  }>();
  const resolvedEditRemoteChallengeId = useMemo(
    () =>
      resolveEditRemotePhotoChallengeId({
        remoteChallengeId:
          editRemoteChallengeId ?? firstRouteParam(routeParams.remoteChallengeId),
        challengeId: firstRouteParam(routeParams.challengeId),
      }),
    [editRemoteChallengeId, routeParams.challengeId, routeParams.remoteChallengeId],
  );
  const isEditMode = Boolean(resolvedEditRemoteChallengeId);
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [addedChallenges, setAddedChallenges] = useState<PhotoCreateAddedChallenge[]>([]);
  const [availableSuggestions, setAvailableSuggestions] = useState<
    PhotoCreateChallengeSuggestion[]
  >([]);
  const [editMeta, setEditMeta] = useState<PhotoEditMeta | null>(null);
  const [editHydrating, setEditHydrating] = useState(isEditMode);

  const addedChallengesRef = useRef(addedChallenges);
  addedChallengesRef.current = addedChallenges;

  const remoteChallengeCountRef = useRef(0);

  useEffect(() => {
    const remoteId = resolvedEditRemoteChallengeId;
    if (!eventId || !remoteId) {
      setEditHydrating(false);
      return;
    }
    let cancelled = false;
    setEditHydrating(true);
    void (async () => {
      let item = getCachedEventChallengeApiItem(remoteId);
      if (!item) {
        await eventRepository.fetchEventChallenges(eventId);
        item = getCachedEventChallengeApiItem(remoteId);
      }
      if (cancelled) {
        return;
      }
      const draftChallenge = item ? photoDraftFromRemoteChallenge(remoteId, item) : null;
      if (!item || !draftChallenge) {
        setEditHydrating(false);
        showShortUserMessage(t('eventDetail.createPhotoUpdateLoadError'));
        goBack();
        return;
      }
      setAddedChallenges([draftChallenge]);
      setEditMeta({
        remoteChallengeId: remoteId,
        position: typeof item.position === 'number' && item.position > 0 ? item.position : 1,
        points: typeof item.points === 'number' ? item.points : 5,
        isActive: item.is_active !== false,
      });
      setEditHydrating(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [resolvedEditRemoteChallengeId, eventId, goBack, t]);

  useFocusEffect(
    useCallback(() => {
      if (!eventId || isEditMode) {
        return undefined;
      }
      const controller = beginRequest();
      void (async () => {
        try {
          const [remote, existing] = await Promise.all([
            eventRepository.fetchEventChallengePhotoSuggestions({
              signal: controller.signal,
            }),
            eventRepository.fetchEventChallenges(eventId, { signal: controller.signal }),
          ]);
          if (controller.signal.aborted) {
            return;
          }
          remoteChallengeCountRef.current = existing.length;
          const used = usedChallengePromptKeySet(existing);
          for (const row of addedChallengesRef.current) {
            const k = normalizeChallengePromptText(row.title);
            if (k.length > 0) {
              used.add(k);
            }
          }
          const next = remote.filter((s) => !used.has(normalizeChallengePromptText(s.title)));
          setAvailableSuggestions(next);
        } catch (e) {
          if (!isAbortError(e)) {
            setAvailableSuggestions([]);
          }
        } finally {
          endRequest(controller);
        }
      })();
      return () => {
        abortAll();
      };
    }, [abortAll, beginRequest, endRequest, eventId, isEditMode]),
  );

  const openComposer = useCallback(() => {
    setComposerOpen(true);
    setDraft('');
  }, []);

  const resetComposerIdle = useCallback(() => {
    setComposerOpen(false);
    setDraft('');
    Keyboard.dismiss();
  }, []);

  const [isPublishing, setIsPublishing] = useState(false);

  const publishPhotoChallenge = useCallback(
    async (title: string, consumedSuggestion?: PhotoCreateChallengeSuggestion) => {
      const trimmed = title.trim();
      if (!trimmed || !eventId || isPublishing) {
        return;
      }

      const challenge = buildAddedChallenge(trimmed, consumedSuggestion);
      const position =
        remoteChallengeCountRef.current + addedChallengesRef.current.length + 1;
      const body = buildPhotoChallengeBody(challenge, position);
      if (!body) {
        showShortUserMessage(t('eventDetail.createPhotoCreateInvalid'));
        return;
      }

      setIsPublishing(true);
      try {
        const ok = await eventRepository.createEventChallenge(eventId, body);
        if (!ok) {
          showShortUserMessage(t('eventDetail.createPhotoCreateError'));
          return;
        }
        remoteChallengeCountRef.current += 1;
        setAddedChallenges((prev) => [challenge, ...prev]);
        const usedKey = normalizeChallengePromptText(trimmed);
        setAvailableSuggestions((prev) =>
          prev.filter(
            (item) =>
              normalizeChallengePromptText(item.title) !== usedKey &&
              item.id !== consumedSuggestion?.id,
          ),
        );
        resetComposerIdle();
        showSuccessToast(t('eventDetail.createPhotoCreateSuccess'));
      } finally {
        setIsPublishing(false);
      }
    },
    [eventId, isPublishing, resetComposerIdle, t],
  );

  const commitDraftChallenge = useCallback(() => {
    void publishPhotoChallenge(draft);
  }, [draft, publishPhotoChallenge]);

  const addChallengeFromSuggestion = useCallback(
    (suggestion: PhotoCreateChallengeSuggestion) => {
      void publishPhotoChallenge(suggestion.title, suggestion);
    },
    [publishPhotoChallenge],
  );

  /** Drop a draft photo challenge only. Call {@link restoreConsumedPhotoSuggestion} when discarding a row that came from suggestions. */
  const deleteChallenge = useCallback((challengeId: string) => {
    setAddedChallenges((prev) => prev.filter((c) => c.id !== challengeId));
  }, []);

  const restoreConsumedPhotoSuggestion = useCallback(
    (suggestion: PhotoCreateChallengeSuggestion) => {
      setAvailableSuggestions((prev) =>
        prev.some((item) => item.id === suggestion.id) ? prev : [suggestion, ...prev],
      );
    },
    [],
  );

  const removeChallengeFromDraftAfterPublish = useCallback((challengeId: string) => {
    setAddedChallenges((prev) => prev.filter((c) => c.id !== challengeId));
  }, []);

  const confirmSingleChallenge = useCallback(
    async (challengeId: string) => {
      if (!eventId || isPublishing) {
        return;
      }
      const challenge = addedChallenges.find((c) => c.id === challengeId);
      if (!challenge) {
        return;
      }
      if (isEditMode && editMeta) {
        const body = buildPhotoChallengeBody(challenge, editMeta.position, {
          points: editMeta.points,
          is_active: editMeta.isActive,
        });
        if (!body) {
          showShortUserMessage(t('eventDetail.createPhotoCreateInvalid'));
          return;
        }
        setIsPublishing(true);
        try {
          const ok = await eventRepository.updateEventChallenge(
            eventId,
            editMeta.remoteChallengeId,
            body,
          );
          if (!ok) {
            showShortUserMessage(t('eventDetail.createPhotoUpdateError'));
            return;
          }
          goBack();
          showSuccessToastAfterNavigation(t('eventDetail.createPhotoUpdateSuccess'));
        } finally {
          setIsPublishing(false);
        }
        return;
      }
      const position = addedChallenges.findIndex((c) => c.id === challengeId) + 1;
      const body = buildPhotoChallengeBody(challenge, position);
      if (!body) {
        showShortUserMessage(t('eventDetail.createPhotoCreateInvalid'));
        return;
      }
      setIsPublishing(true);
      try {
        const ok = await eventRepository.createEventChallenge(eventId, body);
        if (!ok) {
          showShortUserMessage(t('eventDetail.createPhotoCreateError'));
          return;
        }
        removeChallengeFromDraftAfterPublish(challengeId);
        goBack();
        showSuccessToastAfterNavigation(t('eventDetail.createPhotoCreateSuccess'));
      } finally {
        setIsPublishing(false);
      }
    },
    [
      addedChallenges,
      editMeta,
      eventId,
      goBack,
      isEditMode,
      isPublishing,
      removeChallengeFromDraftAfterPublish,
      t,
    ],
  );

  return {
    eventId,
    isEditMode,
    editHydrating,
    composerOpen,
    draft,
    setDraft,
    addedChallenges,
    availableSuggestions,
    isPublishing,
    openComposer,
    resetComposerIdle,
    commitDraftChallenge,
    addChallengeFromSuggestion,
    deleteChallenge,
    restoreConsumedPhotoSuggestion,
    confirmSingleChallenge,
    goBack,
  };
}

export type PhotoCreateDraftContextValue = ReturnType<typeof useEventChallengePhotoCreateScreen>;
