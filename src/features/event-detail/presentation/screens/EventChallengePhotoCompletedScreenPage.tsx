import { colors } from '@/src/ui';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventChallengePhotoCompletedBody } from '../components/EventChallengePhotoCompletedBody';
import { useEventChallengePhotoCompletedScreen } from '../hooks/useEventChallengePhotoCompletedScreen';

const LIME_BG = colors.accent[700];

const CONFETTI_COLORS = [
  colors.states.error,
  colors.states.warning,
  colors.brand[700],
  colors.accent[500],
  colors.accent[400],
  colors.neutral.primary,
];

type Props = {
  eventId: string;
  challengeId: string;
  challengeNumber: number;
  points: number;
};

export function EventChallengePhotoCompletedScreenPage({
  eventId,
  challengeId,
  challengeNumber,
  points,
}: Props) {
  const { winW, thumbUri, summaryLine, displayNumber, closeToEvent, goToRanking, circleTop } =
    useEventChallengePhotoCompletedScreen({
      eventId,
      challengeId,
      challengeNumber,
      points,
    });

  return (
    <View style={styles.root}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <ConfettiCannon
          count={140}
          origin={{ x: winW * 0.2, y: -12 }}
          fadeOut
          fallSpeed={2800}
          explosionSpeed={400}
          colors={CONFETTI_COLORS}
        />
        <ConfettiCannon
          count={140}
          origin={{ x: winW * 0.82, y: -8 }}
          fadeOut
          fallSpeed={3000}
          explosionSpeed={450}
          colors={CONFETTI_COLORS}
        />
        <ConfettiCannon
          count={100}
          origin={{ x: winW * 0.5, y: 0 }}
          fadeOut
          fallSpeed={2600}
          explosionSpeed={380}
          colors={CONFETTI_COLORS}
        />
      </View>

      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <Pressable
          onPress={closeToEvent}
          style={({ pressed }) => [styles.closeCircle, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Cerrar"
          hitSlop={12}
        >
          <Ionicons name="close" size={22} color={colors.neutral.primary} />
        </Pressable>
      </SafeAreaView>

      <EventChallengePhotoCompletedBody
        circleTop={circleTop}
        displayNumber={displayNumber}
        summaryLine={summaryLine}
        thumbUri={thumbUri}
        points={points}
        onOpenRanking={goToRanking}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: LIME_BG,
  },
  headerSafe: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  closeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.primary,
    marginLeft: 14,
    marginTop: 6,
  },
  pressed: {
    opacity: 0.88,
  },
});
