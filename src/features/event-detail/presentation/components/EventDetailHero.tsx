import type { EventDetailReactionPressPayload } from '../../data/eventReactions';
import { getEventStoriesBundle } from '../../data/eventStories';
import { EventDetailLiveAvatarRow } from './EventDetailLiveAvatarRow';
import { EventDetailParticipantsConfirmedPill } from './EventDetailParticipantsConfirmedPill';
import { images } from '@/src/assets/images';
import { EventType } from '@/src/core/api';
import { getEventType } from '@/src/features/home/presentation/utils/eventDisplay';
import { useTranslation } from '@/src/i18n';
import {
  Button,
  colors,
  parseHostsFromLine,
  useRemoteImageCacheEpoch,
  withRemoteImageCacheEpoch,
} from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image as ExpoImage } from 'expo-image';
import { useMemo } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  insetsTop: number;
  eventId: string;
  coverImageUrl?: string;
  /** API `datetime` ISO; drives hero status row (live / scheduled / …). */
  eventDateIso?: string;
  title: string;
  onBackPress: () => void;
  onReactionPress?: (payload: EventDetailReactionPressPayload) => void;
  onProfileAvatarPress: () => void;
  liveReactionImages: readonly [
    ImageSourcePropType,
    ImageSourcePropType,
    ImageSourcePropType,
    ImageSourcePropType,
  ];
  /** Anfitrión programado (día futuro): pill de invitados; si no, fila de reacciones (como invitado). */
  showOrganizerGuestsPill?: boolean;
  /** Comma / " y " separated display names for the facepile (invited participants). */
  participantNamesLine?: string;
  confirmedGuestsCount?: number;
  totalInvitedGuestsCount?: number;
  onOpenGuestsModal?: () => void;
};

const HERO_H = 260;

type HeroStatus = { dot: string; label: string };

export function EventDetailHero({
  insetsTop,
  eventId,
  coverImageUrl,
  eventDateIso,
  title,
  onBackPress,
  onReactionPress,
  onProfileAvatarPress,
  liveReactionImages,
  showOrganizerGuestsPill = false,
  participantNamesLine = '',
  confirmedGuestsCount = 0,
  totalInvitedGuestsCount = 0,
  onOpenGuestsModal,
}: Props) {
  const { t } = useTranslation();
  const mediaCacheEpoch = useRemoteImageCacheEpoch();
  const heroSource: ImageSourcePropType | undefined = coverImageUrl
    ? { uri: coverImageUrl }
    : undefined;
  const cachedHeroSource = withRemoteImageCacheEpoch(heroSource, mediaCacheEpoch);
  const participantNames = parseHostsFromLine(participantNamesLine);

  const liveRowProfileImage = useMemo((): ImageSourcePropType => {
    const bundle = getEventStoriesBundle(eventId);
    if (bundle) {
      return { uri: bundle.authorAvatarUrl };
    }
    if (coverImageUrl) {
      return { uri: coverImageUrl };
    }
    return images.tabs.profileInactive;
  }, [eventId, coverImageUrl]);

  const heroStatus = useMemo((): HeroStatus | null => {
    const trimmed = eventDateIso?.trim() ?? '';
    if (!trimmed || Number.isNaN(Date.parse(trimmed))) {
      return null;
    }
    const kind = getEventType(trimmed);
    switch (kind) {
      case EventType.EventLive:
        return { dot: colors.states.active, label: t('eventDetail.heroStatusLive') };
      case EventType.EventToStartToday:
        return { dot: colors.states.warning, label: t('eventDetail.heroStatusStartingSoon') };
      case EventType.EventToStart:
        return { dot: colors.neutral.disabled, label: t('eventDetail.heroStatusScheduled') };
      case EventType.EventFinished:
        return { dot: colors.brand[500], label: t('eventDetail.heroStatusMemory') };
      default:
        return null;
    }
  }, [eventDateIso, t]);

  return (
    <>
      <View style={styles.heroWrap}>
        {cachedHeroSource ? (
          <ExpoImage
            source={cachedHeroSource}
            style={styles.heroImg}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        ) : (
          <View style={[styles.heroImg, styles.heroPlaceholder]} />
        )}
        <View style={styles.heroOverlay} pointerEvents="none" />
        <View style={[styles.heroTopRow, { paddingTop: insetsTop + 8 }]}>
          <Button
            onPress={onBackPress}
            style={styles.backCircle}
            accessibilityLabel={t('common.back')}
          >
            <ExpoImage source={images.common.back} style={styles.backIcon} contentFit="contain" />
          </Button>
        </View>
      </View>

      {showOrganizerGuestsPill ? (
        <View style={styles.participantsConfirmedSlot}>
          <EventDetailParticipantsConfirmedPill
            participantNames={participantNames}
            confirmedCount={confirmedGuestsCount}
            totalInvitedCount={totalInvitedGuestsCount}
            onPress={onOpenGuestsModal}
          />
        </View>
      ) : (
        <EventDetailLiveAvatarRow
          profileImage={liveRowProfileImage}
          reactionSources={liveReactionImages}
          onReactionPress={onReactionPress}
          onProfileAvatarPress={onProfileAvatarPress}
        />
      )}

      {heroStatus ? (
        <View
          style={styles.heroStatusRow}
          accessibilityRole="text"
          accessibilityLabel={heroStatus.label}
        >
          <View style={[styles.heroStatusDot, { backgroundColor: heroStatus.dot }]} />
          <Text style={styles.heroStatusLabel}>{heroStatus.label}</Text>
        </View>
      ) : null}

      <Text style={styles.eventTitle}>{title}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  heroWrap: {
    marginHorizontal: -20,
    height: HERO_H,
    position: 'relative',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay.black70,
  },
  heroImg: {
    width: '100%',
    height: HERO_H,
  },
  heroPlaceholder: {
    backgroundColor: colors.background.primary,
  },
  heroTopRow: {
    position: 'absolute',
    left: 12,
    right: 16,
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  /** Half of pill visual height so the chip sits on the hero bottom edge (see live avatar row). */
  participantsConfirmedSlot: {
    marginTop: -28,
    alignItems: 'center',
  },
  heroStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  heroStatusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  heroStatusLabel: {
    color: colors.neutral.lightest,
    fontFamily: fontFamilies.signikaRegular,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  eventTitle: {
    color: colors.neutral.primary,
    fontSize: 28,
    fontWeight: '500',
    lineHeight: 36,
    textAlign: 'center',
    fontFamily: fontFamilies.medium,
    marginBottom: 20,
  },
});
