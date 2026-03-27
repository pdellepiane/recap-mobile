import { colors } from '@/src/ui';
import type { MutableRefObject } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

type VerifyCodeDigitInputsProps = {
  digits: string[];
  inputRefs: MutableRefObject<(TextInput | null)[]>;
  hasError: boolean;
  isCodeValid: boolean;
  onUpdateDigit: (index: number, text: string) => void;
  onHandleKeyPress: (index: number, key: string) => void;
  onFocusInput: (index: number) => void;
};

export function VerifyCodeDigitInputs({
  digits,
  inputRefs,
  hasError,
  isCodeValid,
  onUpdateDigit,
  onHandleKeyPress,
  onFocusInput,
}: VerifyCodeDigitInputsProps) {
  return (
    <View style={styles.digitRow}>
      {digits.map((digit, index) => (
        <TextInput
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          value={digit}
          onChangeText={(text) => onUpdateDigit(index, text)}
          onKeyPress={({ nativeEvent }) => onHandleKeyPress(index, nativeEvent.key)}
          keyboardType="number-pad"
          maxLength={6}
          style={[
            styles.digitInput,
            hasError && styles.digitInputInvalid,
            isCodeValid && styles.digitInputValid,
          ]}
          selectTextOnFocus
          onFocus={() => onFocusInput(index)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  digitRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  digitInput: {
    flex: 1,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: colors.background.elevated,
    borderRadius: 12,
    color: colors.neutral.primary,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  digitInputInvalid: {
    borderColor: colors.states.error,
    color: colors.states.error,
  },
  digitInputValid: {
    borderColor: colors.states.active,
    color: colors.states.active,
  },
});
