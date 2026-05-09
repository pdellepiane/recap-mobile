import { images } from '@/src/assets/images';
import { colors } from '@/src/ui';
import { FontAwesome5 } from '@expo/vector-icons';
import { Image, StyleSheet, View } from 'react-native';

type Props = {
  isCorrect: boolean;
};

export function EventChallengeQuizResultOutcomeIcon({ isCorrect }: Props) {
  return (
    <View style={styles.resultIconWrap} pointerEvents="none">
      <View style={styles.resultIconCircle}>
        {isCorrect ? (
          <View style={styles.resultCheckLayout}>
            <Image
              source={images.common.checkGreen}
              style={styles.resultCheckIcon}
              resizeMode="contain"
              accessibilityElementsHidden
            />
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
  resultIconWrap: { width: 91, height: 91, marginBottom: 20 },
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
  resultCheckIcon: { width: 52, height: 52 },
  resultWrongIconLayout: {
    width: 56,
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
