import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, Platform, Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  onPress: () => void;
};

/** Dashed “enter new question” tap target (opens composer). */
export function EventChallengeQuizCreateComposerIdle({ onPress }: Props) {
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.composerIdle, pressed && styles.composerIdlePressed]}
      accessibilityRole="button"
      accessibilityLabel={t('eventDetail.createQuizEnterNewQuestion')}
    >
      <Image source={images.common.edit} style={styles.editIcon} resizeMode="contain" />
      <Text style={styles.composerIdleText}>{t('eventDetail.createQuizEnterNewQuestion')}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  editIcon: {
    width: 25,
    height: 25,
  },
  composerIdle: {
    minHeight: 96,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        borderWidth: 1,
        borderColor: colors.neutral.primary,
        borderStyle: 'dashed',
      },
      default: {
        borderWidth: 1,
        borderColor: colors.neutral.primary,
      },
    }),
  },
  composerIdlePressed: {
    opacity: 0.88,
  },
  composerIdleText: {
    marginLeft: 12,
    color: colors.accent[500],
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.signikaRegular,
    fontWeight: '400',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});
