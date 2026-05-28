import type { EventChallengePostBody } from '@/src/core/api/types';
import { eventRepository } from '@/src/core/di/container';
import {
  normalizeChallengePromptText,
  usedChallengePromptKeySet,
} from '@/src/features/events/data/eventChallengesMap';
import { useTranslation } from '@/src/i18n';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { showShortUserMessage } from '@/src/ui';
import { isAbortError } from '@/src/core/http/isAbortError';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';
import { Keyboard } from 'react-native';

type Params = {
  eventId: string;
};

export type PhotoCreateChallengeSuggestion = {
  id: string;
  title: string;
};

export type PhotoCreateAddedChallenge = {
  id: string;
  title: string;
  consumedSuggestion?: PhotoCreateChallengeSuggestion;
};

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
): EventChallengePostBody | null {
  const title = challenge.title.trim();
  if (!title) {
    return null;
  }
  return {
    type: 'picture',
    title,
    question: title,
    points: 5,
    position,
    is_active: true,
  };
}

export function useEventChallengePhotoCreateScreen({ eventId }: Params) {
  const { t } = useTranslation();
  const { goBack } = useCoordinator();
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [addedChallenges, setAddedChallenges] = useState<PhotoCreateAddedChallenge[]>([]);
  const [availableSuggestions, setAvailableSuggestions] = useState<
    PhotoCreateChallengeSuggestion[]
  >([]);

  const addedChallengesRef = useRef(addedChallenges);
  addedChallengesRef.current = addedChallenges;

  useFocusEffect(
    useCallback(() => {
      if (!eventId) {
        return undefined;
      }
      const controller = new AbortController();
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
        }
      })();
      return () => {
        controller.abort();
      };
    }, [eventId]),
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

  const commitDraftChallenge = useCallback(() => {
    const text = draft.trim();
    if (!text) {
      return;
    }
    setAddedChallenges((prev) => [buildAddedChallenge(text), ...prev]);
    resetComposerIdle();
  }, [draft, resetComposerIdle]);

  const addChallengeFromSuggestion = useCallback(
    (suggestion: PhotoCreateChallengeSuggestion) => {
      const trimmed = suggestion.title.trim();
      if (!trimmed) {
        return;
      }
      setAddedChallenges((prev) => [buildAddedChallenge(trimmed, suggestion), ...prev]);
      setAvailableSuggestions((prev) => prev.filter((item) => item.id !== suggestion.id));
      resetComposerIdle();
    },
    [resetComposerIdle],
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
      if (!eventId) {
        return;
      }
      const challenge = addedChallenges.find((c) => c.id === challengeId);
      if (!challenge) {
        return;
      }
      const position = addedChallenges.findIndex((c) => c.id === challengeId) + 1;
      const body = buildPhotoChallengeBody(challenge, position);
      if (!body) {
        showShortUserMessage(t('eventDetail.createPhotoCreateInvalid'));
        return;
      }
      const ok = await eventRepository.createEventChallenge(eventId, body);
      if (!ok) {
        showShortUserMessage(t('eventDetail.createPhotoCreateError'));
        return;
      }
      showShortUserMessage(t('eventDetail.createPhotoCreateSuccess'));
      removeChallengeFromDraftAfterPublish(challengeId);
      goBack();
    },
    [addedChallenges, eventId, goBack, removeChallengeFromDraftAfterPublish, t],
  );

  return {
    eventId,
    composerOpen,
    draft,
    setDraft,
    addedChallenges,
    availableSuggestions,
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
