import analytics from '@/src/core/analytics';
import type { Event } from '@/src/domain/entities';
import { useCallback, useState } from 'react';
import { Share } from 'react-native';

type Params = {
  eventId: string;
  event: Event | null | undefined;
};

export function useEventDetailShare({ eventId, event }: Params) {
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);

  const onSharePress = useCallback(() => {
    void analytics.trackAction('open_share_sheet', {
      what: 'event_detail_share_sheet',
      why: 'share_event',
      eventId,
    });
    setIsShareSheetOpen(true);
  }, [eventId]);

  const onShareSheetClose = useCallback(() => {
    setIsShareSheetOpen(false);
  }, []);

  const onShareConfirm = useCallback(async () => {
    if (!event) {
      return;
    }
    const chunks = [event.title, event.date, event.location, event.shareUrl]
      .map((v) => v?.trim())
      .filter(Boolean);
    const message = chunks.join('\n');
    if (!message) {
      return;
    }
    try {
      await Share.share({
        title: event.title,
        message,
      });
    } catch {
      // Native share can be cancelled or unavailable; either way the sheet should close.
    } finally {
      setIsShareSheetOpen(false);
    }
  }, [event]);

  const onShareConfirmPress = useCallback(() => {
    void onShareConfirm();
  }, [onShareConfirm]);

  return {
    isShareSheetOpen,
    onSharePress,
    onShareSheetClose,
    onShareConfirm,
    onShareConfirmPress,
    handlers: {
      onSharePress,
      onShareSheetClose,
      onShareConfirm,
      onShareConfirmPress,
    },
  };
}
