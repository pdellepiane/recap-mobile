import {
  EVENT_DETAIL_REACTION_BY_SLOT_INDEX,
  type EventDetailReactionPressPayload,
} from '../../../data/eventReactions';
import { EventDetailReactionButton } from './EventDetailReactionButton';
import { useTranslation } from '@/src/i18n';
import { Button, colors, useRemoteImageCacheEpoch, withRemoteImageCacheEpoch } from '@/src/ui';
import { Image as ExpoImage } from 'expo-image';
import { memo, useCallback, useMemo, useRef } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { StyleSheet, View } from 'react-native';

const AVATAR = 100;

type Props = {
  profileImage: ImageSourcePropType;
  /** Four reactions in order: left×2, right×2 (local assets or URI). */
  reactionSources: readonly [
    ImageSourcePropType,
    ImageSourcePropType,
    ImageSourcePropType,
    ImageSourcePropType,
  ];
  /** When set, each tap measures the window center and triggers the floating animation + API. */
  onReactionPress?: (payload: EventDetailReactionPressPayload) => void;
  /** Tap on the center avatar (e.g. open stories when available). */
  onProfileAvatarPress: () => void;
};

/**
 * “Live execution” detail row: reactions in circles + center avatar with lime border.
 */
export const EventDetailLiveAvatarRow = memo(function EventDetailLiveAvatarRow({
  profileImage,
  reactionSources,
  onReactionPress,
  onProfileAvatarPress,
}: Props) {
  const { t } = useTranslation();
  const mediaCacheEpoch = useRemoteImageCacheEpoch();
  const cachedProfileImage = useMemo(
    () => withRemoteImageCacheEpoch(profileImage, mediaCacheEpoch),
    [mediaCacheEpoch, profileImage],
  );
  const itemRefs = useRef<(View | null)[]>([]);

  const handlePress = useCallback(
    (index: number, source: ImageSourcePropType) => {
      if (!onReactionPress) {
        return;
      }
      const reaction = EVENT_DETAIL_REACTION_BY_SLOT_INDEX[index];
      if (!reaction) {
        return;
      }
      itemRefs.current[index]?.measureInWindow((x, y, w, h) => {
        onReactionPress({ reaction, source, center: { x: x + w / 2, y: y + h / 2 } });
      });
    },
    [onReactionPress],
  );

  const cells = useMemo(
    () =>
      reactionSources.map((source, index) => ({
        source,
        index,
      })),
    [reactionSources],
  );

  const avatarBtn = (
    <Button onPress={onProfileAvatarPress} accessibilityLabel={t('eventDetail.viewStories')}>
      <ExpoImage
        source={cachedProfileImage}
        style={styles.avatar}
        contentFit="cover"
        cachePolicy="memory-disk"
      />
    </Button>
  );

  /** Fuera de ventana inicio+24h no se monta `FloatingReactions` → sin `onReactionPress`; no mostrar emojis. */
  if (!onReactionPress) {
    return <View style={styles.row}>{avatarBtn}</View>;
  }

  return (
    <View style={styles.row}>
      {cells.slice(0, 2).map(({ source, index }) => (
        <EventDetailReactionButton
          key={index}
          index={index}
          source={source}
          onPress={handlePress}
          contentRef={(el) => {
            itemRefs.current[index] = el;
          }}
        />
      ))}
      {avatarBtn}
      {cells.slice(2, 4).map(({ source, index }) => (
        <EventDetailReactionButton
          key={index}
          index={index}
          source={source}
          onPress={handlePress}
          contentRef={(el) => {
            itemRefs.current[index] = el;
          }}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: -AVATAR / 2,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    borderWidth: 4,
    borderColor: colors.states.active,
    overflow: 'hidden',
  },
});
