import { EventChallengePhotoCompletedBody } from '../components/photo/EventChallengePhotoCompletedBody';
import { useEventChallengePhotoCompletedScreen } from '../hooks/useEventChallengePhotoCompletedScreen';
import { useTranslation } from '@/src/i18n';
import { CloseButton, colors } from '@/src/ui';
import { StyleSheet, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const { t } = useTranslation();
  const { winW, thumbUri, summaryLine, displayNumber, onClose, goToRanking } =
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
        <CloseButton
          onPress={onClose}
          style={styles.closeCircle}
          iconStyle={styles.closeIcon}
          accessibilityLabel={t('common.close')}
          hitSlop={12}
        />
      </SafeAreaView>

      <EventChallengePhotoCompletedBody
        displayNumber={displayNumber}
        summaryLine={summaryLine}
        thumbUri={thumbUri}
        pointsEarned={points}
        onOpenRanking={goToRanking}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.accent[700],
  },
  headerSafe: {
    backgroundColor: colors.transparent.white,
  },
  closeCircle: {
    marginLeft: 20,
    marginTop: 6,
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
});
