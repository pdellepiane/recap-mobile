import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import * as Clipboard from 'expo-clipboard';
import { memo, useCallback } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  shareUrl: string;
};

export const EventDetailShareUrlRow = memo(function EventDetailShareUrlRow({ shareUrl }: Props) {
  const { t } = useTranslation();

  const onCopyPress = useCallback(async () => {
    const trimmed = shareUrl.trim();
    if (!trimmed) {
      return;
    }
    await Clipboard.setStringAsync(trimmed);
  }, [shareUrl]);

  return (
    <View style={styles.urlRow}>
      <Text style={styles.urlText} numberOfLines={1}>
        {shareUrl}
      </Text>
      <Pressable
        onPress={onCopyPress}
        hitSlop={12}
        style={({ pressed }) => [styles.copyButton, pressed && styles.copyButtonPressed]}
        accessibilityRole="button"
        accessibilityLabel={t('common.copyLinkToClipboard')}
      >
        <Image source={images.common.copy} style={styles.copyIcon} resizeMode="contain" />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  urlRow: {
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.background.primary,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  urlText: {
    flex: 1,
    marginRight: 12,
    color: colors.neutral.primary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '300',
    fontFamily: fontFamilies.signikaLight,
  },
  copyIcon: {
    width: 14,
    height: 14,
  },
  copyButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  copyButtonPressed: {
    opacity: 0.55,
  },
});
