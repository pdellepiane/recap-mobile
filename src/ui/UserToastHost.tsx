import { images } from '@/src/assets/images';
import { colors } from './colors';
import { radii } from './radii';
import {
  subscribeUserToast,
  type UserToastPayload,
  type UserToastVariant,
} from './userToast';
import { fontFamilies } from './typography';
import { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function toastPalette(variant: UserToastVariant) {
  if (variant === 'success') {
    return {
      surface: colors.accent[500],
      message: colors.neutral.onLime,
      iconWrap: colors.background.primary,
    };
  }
  return {
    surface: colors.background.elevated,
    message: colors.neutral.primary,
    iconWrap: colors.brand[600],
  };
}

/**
 * Global toast overlay — mount once in the root layout.
 */
export function UserToastHost() {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<UserToastPayload | null>(null);

  useEffect(() => subscribeUserToast(setToast), []);

  if (!toast) {
    return null;
  }

  const palette = toastPalette(toast.variant);
  const showSuccessIcon = toast.variant === 'success';

  return (
    <View
      style={[styles.host, { paddingBottom: Math.max(insets.bottom, 16) + 12 }]}
      pointerEvents="box-none"
    >
      <Animated.View
        entering={FadeInDown.duration(320).springify().damping(18)}
        exiting={FadeOutUp.duration(220)}
        style={[styles.toast, { backgroundColor: palette.surface }]}
      >
        {showSuccessIcon ? (
          <View style={[styles.iconWrap, { backgroundColor: palette.iconWrap }]}>
            <Image
              source={images.common.check}
              style={styles.checkIcon}
              resizeMode="contain"
              accessibilityElementsHidden
            />
          </View>
        ) : null}
        <Text style={[styles.message, { color: palette.message }]} numberOfLines={3}>
          {toast.message}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    maxWidth: 360,
    width: '92%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radii.card,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.28,
        shadowRadius: 16,
      },
      android: { elevation: 10 },
      default: {},
    }),
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    width: 22,
    height: 22,
  },
  message: {
    flex: 1,
    fontFamily: fontFamilies.semiBold,
    fontSize: 15,
    lineHeight: 20,
  },
});
