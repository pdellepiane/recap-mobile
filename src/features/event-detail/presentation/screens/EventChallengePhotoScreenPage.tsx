import { EventChallengePhotoIntroCard } from '../components/EventChallengePhotoIntroCard';
import { useEventChallengePhotoScreen } from '../hooks/useEventChallengePhotoScreen';
import { colors } from '@/src/ui';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_BG = colors.background.primary;
const WIN_H = Dimensions.get('window').height;

type Props = {
  eventId: string;
  challengeId: string;
  challengeNumber?: number;
};

/**
 * Photo challenge: card with decorative camera and “Take photo” action.
 */
export function EventChallengePhotoScreenPage({ eventId, challengeId, challengeNumber }: Props) {
  const insets = useSafeAreaInsets();
  const { goBack, numberLabel, instructionParagraphs, handleOpenCamera } =
    useEventChallengePhotoScreen({
      eventId,
      challengeId,
      challengeNumber,
    });

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.topSafe}>
        <Pressable
          onPress={goBack}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={28} color={colors.neutral.primary} />
        </Pressable>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24, minHeight: WIN_H },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <EventChallengePhotoIntroCard
          numberLabel={numberLabel}
          instructionParagraphs={instructionParagraphs}
          onOpenCamera={handleOpenCamera}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: SCREEN_BG,
  },
  topSafe: {
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
