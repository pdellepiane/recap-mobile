import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { CloseButton, Switch, colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { useEffect, useRef, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const LIME = colors.accent[500];

type Props = {
  visible: boolean;
  initialText: string;
  initialCorrect: boolean;
  onClose: () => void;
  /** Persist draft + correct flag (latest ON wins at parent). */
  onSave: (text: string, isCorrect: boolean) => void;
};

export function EventChallengeQuizCreateAnswerEditModal({
  visible,
  initialText,
  initialCorrect,
  onClose,
  onSave,
}: Props) {
  const { t } = useTranslation();
  const inputRef = useRef<TextInput>(null);
  const [text, setText] = useState(initialText);
  const [isCorrect, setIsCorrect] = useState(initialCorrect);

  useEffect(() => {
    if (!visible) {
      return;
    }
    setText(initialText);
    setIsCorrect(initialCorrect);
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [visible, initialText, initialCorrect]);

  const handleClose = () => {
    onSave(text.trim(), isCorrect);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <CloseButton onPress={handleClose} accessibilityLabel={t('common.close')} />
        <View style={styles.sheet}>
          <Text style={styles.inputTitle}>{t('eventDetail.createQuizAnswerEditTitle')}</Text>
          <View style={styles.inputShell}>
            <TextInput
              ref={inputRef}
              value={text}
              onChangeText={setText}
              style={styles.input}
              placeholderTextColor={colors.neutral.primary}
              selectionColor={colors.neutral.primary}
              autoCorrect
              returnKeyType="done"
              onSubmitEditing={handleClose}
              blurOnSubmit={false}
            />
            {text.length > 0 ? (
              <Pressable
                onPress={() => setText('')}
                hitSlop={10}
                style={styles.clearTap}
                accessibilityRole="button"
                accessibilityLabel={t('eventDetail.createQuizAnswerClearA11y')}
              >
                <Image
                  source={images.common.camera.close}
                  style={styles.clearIcon}
                  resizeMode="contain"
                  accessibilityElementsHidden
                />
              </Pressable>
            ) : null}
          </View>

          <Switch
            label={t('eventDetail.createQuizCorrectAnswerLabel')}
            value={isCorrect}
            onValueChange={setIsCorrect}
            rowStyle={styles.switchRow}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 56,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  sheet: {
    marginHorizontal: 20,
    paddingTop: '60%',
  },
  inputTitle: {
    alignSelf: 'stretch',
    color: colors.neutral.primary,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.signikaRegular,
    fontWeight: '400',
    marginBottom: 10,
  },
  inputShell: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.neutral.primary,
    backgroundColor: colors.background.tertiary,
    paddingLeft: 18,
    paddingRight: 10,
    paddingVertical: 4,
    height: 56,
  },
  input: {
    flex: 1,
    color: colors.neutral.primary,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.signikaSemiBold,
    fontWeight: '600',
    paddingVertical: 10,
  },
  clearTap: {
    padding: 8,
  },
  clearIcon: {
    width: 18,
    height: 18,
  },
  switchRow: {
    marginTop: 22,
    alignItems: 'center',
  },
});
