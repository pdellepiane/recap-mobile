import { colors } from '@/src/ui';
import { FontAwesome5 } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

type Props = {
  isCorrect: boolean;
  marginTop: number;
};

export function EventChallengeQuizResultOutcomeIcon({ isCorrect, marginTop }: Props) {
  return (
    <View style={[styles.resultIconWrap, { marginTop }]} pointerEvents="none">
      <View style={styles.resultIconCircle}>
        {isCorrect ? (
          <View style={styles.resultCheckLayout}>
            <FontAwesome5 name="check" size={52} color={colors.states.active} solid />
          </View>
        ) : (
          <View style={styles.resultWrongIconLayout}>
            <FontAwesome5 name="times" size={44} color={colors.states.error} solid />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  resultIconWrap: { width: 91, height: 91, marginBottom: 10 },
  resultIconCircle: {
    width: 91,
    height: 91,
    borderRadius: 45.5,
    backgroundColor: colors.neutral.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultCheckLayout: {
    width: 68,
    height: 56,
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultWrongIconLayout: {
    width: 56,
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
