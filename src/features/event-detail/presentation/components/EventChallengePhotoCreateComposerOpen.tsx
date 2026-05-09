import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import type { RefObject } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const LIME = colors.accent[500];
const PLUS_DISABLED = colors.quizCreate.plusDisabled;
const PHOTO_ICON_TINT = colors.accent[500];

type Props = {
  inputRef: RefObject<TextInput | null>;
  draft: string;
  setDraft: (text: string) => void;
  canCommitDraft: boolean;
  onCommit: () => void;
};

export function EventChallengePhotoCreateComposerOpen({
  inputRef,
  draft,
  setDraft,
  canCommitDraft,
  onCommit,
}: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.composerOpen}>
      <View style={styles.composerOpenRow}>
        <View style={styles.composerLeft}>
          <View style={styles.composerLabelRow}>
            <Image
              source={images.eventDetail.challenges.photoLabelIcon}
              style={styles.composerPhotoIcon}
              resizeMode="contain"
              tintColor={PHOTO_ICON_TINT}
              accessibilityElementsHidden
            />
            <Text style={styles.composerLabel}>{t('eventDetail.createPhotoNewPromptLabel')}</Text>
          </View>
          <TextInput
            ref={inputRef}
            value={draft}
            onChangeText={setDraft}
            style={styles.composerInput}
            placeholderTextColor={colors.neutral.tertiary}
            multiline
            maxLength={180}
            selectionColor={colors.neutral.primary}
          />
        </View>
        <Pressable
          onPress={onCommit}
          disabled={!canCommitDraft}
          style={({ pressed }) => [
            styles.plusWrap,
            pressed && canCommitDraft && styles.plusPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={t('eventDetail.createPhotoAddDraftA11y')}
        >
          <Image
            source={images.eventDetail.challenges.addIcon}
            style={[styles.addIcon, { tintColor: canCommitDraft ? LIME : PLUS_DISABLED }]}
            resizeMode="contain"
            accessibilityElementsHidden
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  composerOpen: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral.primary,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 28,
    minHeight: 92,
  },
  composerOpenRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  composerLeft: {
    flex: 1,
    minWidth: 0,
  },
  composerLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  composerPhotoIcon: {
    width: 22,
    height: 22,
  },
  composerLabel: {
    color: colors.accent[500],
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
    fontWeight: '600',
  },
  composerInput: {
    color: colors.neutral.primary,
    fontSize: 20,
    lineHeight: 28,
    fontFamily: fontFamilies.signikaRegular,
    fontWeight: '400',
    paddingVertical: 0,
    margin: 0,
    minHeight: 28,
    textAlignVertical: 'top',
  },
  plusWrap: {
    marginLeft: 10,
    paddingHorizontal: 4,
    paddingVertical: 6,
    justifyContent: 'center',
  },
  addIcon: {
    width: 24,
    height: 24,
  },
  plusPressed: {
    opacity: 0.75,
  },
});
