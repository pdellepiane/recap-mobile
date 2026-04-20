import { EventDetailLiveAvatarRow } from './EventDetailLiveAvatarRow';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Ionicons } from '@expo/vector-icons';
import type { ImageSourcePropType } from 'react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type EventDetailHeroProps = {
  insetsTop: number;
  heroSource: { uri: string } | number | undefined;
  title: string;
  onBackPress: () => void;
  onReactionPress?: (source: ImageSourcePropType, center: { x: number; y: number }) => void;
  onProfileAvatarPress: () => void;
  liveRowCenterImage: ImageSourcePropType;
  liveReactionImages: readonly [
    ImageSourcePropType,
    ImageSourcePropType,
    ImageSourcePropType,
    ImageSourcePropType,
  ];
};

const HERO_H = 260;

export function EventDetailHero({
  insetsTop,
  heroSource,
  title,
  onBackPress,
  onReactionPress,
  onProfileAvatarPress,
  liveRowCenterImage,
  liveReactionImages,
}: EventDetailHeroProps) {
  return (
    <>
      <View style={styles.heroWrap}>
        {heroSource ? (
          <Image source={heroSource} style={styles.heroImg} resizeMode="cover" />
        ) : (
          <View style={[styles.heroImg, styles.heroPlaceholder]} />
        )}
        <View style={styles.heroOverlay} pointerEvents="none" />
        <View style={[styles.heroTopRow, { paddingTop: insetsTop + 8 }]}>
          <Pressable
            onPress={onBackPress}
            style={({ pressed }) => [styles.backCircle, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Volver"
          >
            <Ionicons name="chevron-back" size={26} color={colors.neutral.primary} />
          </Pressable>
        </View>
      </View>

      <EventDetailLiveAvatarRow
        profileImage={liveRowCenterImage}
        reactionSources={liveReactionImages}
        onReactionPress={onReactionPress}
        onProfileAvatarPress={onProfileAvatarPress}
      />

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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.overlay.black45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
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
