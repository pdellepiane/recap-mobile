import {
  EVENT_DETAIL_REACTION_BY_SLOT_INDEX,
  type EventDetailReactionPressPayload,
} from '../../../data/eventReactions';
import { useTranslation } from '@/src/i18n';
import { Button, colors, useRemoteImageCacheEpoch, withRemoteImageCacheEpoch } from '@/src/ui';
import { Image as ExpoImage } from 'expo-image';
import { useRef } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Image, StyleSheet, View } from 'react-native';

const AVATAR = 100;
const EMOJI = 64;
const REACTION_IMG = 53;

const REACTION_A11Y_KEYS = [
  'eventDetail.reactionParty',
  'eventDetail.reactionSad',
  'eventDetail.reactionLaugh',
  'eventDetail.reactionHearts',
] as const;

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
export function EventDetailLiveAvatarRow({
  profileImage,
  reactionSources,
  onReactionPress,
  onProfileAvatarPress,
}: Props) {
  const { t } = useTranslation();
  const mediaCacheEpoch = useRemoteImageCacheEpoch();
  const cachedProfileImage = withRemoteImageCacheEpoch(profileImage, mediaCacheEpoch);
  const [r0, r1, r2, r3] = reactionSources;
  const itemRefs = useRef<(View | null)[]>([]);

  const handlePress = (index: number, source: ImageSourcePropType) => {
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
  };

  const cells = [
    { source: r0, index: 0 },
    { source: r1, index: 1 },
    { source: r2, index: 2 },
    { source: r3, index: 3 },
  ] as const;

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
        <Button
          key={index}
          accessibilityLabel={t('common.reactionA11y', {
            label: t(REACTION_A11Y_KEYS[index] ?? 'eventDetail.reactionParty'),
          })}
          onPress={() => handlePress(index, source)}
          style={styles.reactionHit}
          contentRef={(el) => {
            itemRefs.current[index] = el;
          }}
        >
          <Image source={source} style={styles.reactionImg} resizeMode="contain" />
        </Button>
      ))}
      {avatarBtn}
      {cells.slice(2, 4).map(({ source, index }) => (
        <Button
          key={index}
          accessibilityLabel={t('common.reactionA11y', {
            label: t(REACTION_A11Y_KEYS[index] ?? 'eventDetail.reactionParty'),
          })}
          onPress={() => handlePress(index, source)}
          style={styles.reactionHit}
          contentRef={(el) => {
            itemRefs.current[index] = el;
          }}
        >
          <Image source={source} style={styles.reactionImg} resizeMode="contain" />
        </Button>
      ))}
    </View>
  );
}

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
  reactionHit: {
    width: EMOJI,
    height: EMOJI,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactionImg: {
    width: REACTION_IMG,
    height: REACTION_IMG,
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
