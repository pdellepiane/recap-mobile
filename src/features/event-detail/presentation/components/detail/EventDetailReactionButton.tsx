import { useTranslation } from '@/src/i18n';
import { Button } from '@/src/ui';
import { memo, useCallback } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Image, StyleSheet, View } from 'react-native';

const REACTION_A11Y_KEYS = [
  'eventDetail.reactionParty',
  'eventDetail.reactionSad',
  'eventDetail.reactionLaugh',
  'eventDetail.reactionHearts',
] as const;

type Props = {
  index: number;
  source: ImageSourcePropType;
  onPress: (index: number, source: ImageSourcePropType) => void;
  contentRef: (el: View | null) => void;
};

export const EventDetailReactionButton = memo(function EventDetailReactionButton({
  index,
  source,
  onPress,
  contentRef,
}: Props) {
  const { t } = useTranslation();
  const onButtonPress = useCallback(() => onPress(index, source), [index, onPress, source]);

  return (
    <Button
      accessibilityLabel={t('common.reactionA11y', {
        label: t(REACTION_A11Y_KEYS[index] ?? 'eventDetail.reactionParty'),
      })}
      onPress={onButtonPress}
      style={styles.reactionHit}
      contentRef={contentRef}
    >
      <Image source={source} style={styles.reactionImg} resizeMode="contain" />
    </Button>
  );
});

const styles = StyleSheet.create({
  reactionHit: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactionImg: {
    width: 53,
    height: 53,
  },
});
