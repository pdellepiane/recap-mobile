import { useTranslation } from '@/src/i18n';
import { Button, colors, HostInitialsAvatar } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

const GRADIENT_LEFT = 'rgba(95, 43, 216, 1)';
const GRADIENT_RIGHT = 'rgba(179, 246, 151, 1)';
const LABEL_COLOR = '#1E0F3D';

const BORDER_W = 2;
const OUTER_RADIUS = 28;
const INNER_RADIUS = OUTER_RADIUS - BORDER_W;
const AVATAR_SIZE = 36;
const AVATAR_OVERLAP = 12;

export type EventDetailParticipantsConfirmedPillProps = {
  participantNames: readonly string[];
  confirmedCount: number;
  totalInvitedCount: number;
  onPress?: () => void;
};

export function EventDetailParticipantsConfirmedPill({
  participantNames,
  confirmedCount,
  totalInvitedCount,
  onPress,
}: EventDetailParticipantsConfirmedPillProps) {
  const { t } = useTranslation();
  const a11yLabel = t('eventDetail.participantsConfirmedA11y', {
    confirmed: confirmedCount,
    total: totalInvitedCount,
  });

  return (
    <Button onPress={onPress ?? (() => {})} accessibilityLabel={a11yLabel}>
      <LinearGradient
        colors={[GRADIENT_LEFT, GRADIENT_RIGHT]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradientRing}
      >
        <View style={styles.innerPill}>
          <View style={styles.avatarsRow}>
            {participantNames.slice(0, 3).map((name, i) => (
              <HostInitialsAvatar
                key={`${name}-${i}`}
                fullName={name}
                colorIndex={i}
                size={AVATAR_SIZE}
                borderWidth={2}
                borderColor={colors.background.primary}
                style={[
                  i > 0 ? { marginLeft: -AVATAR_OVERLAP } : null,
                  { zIndex: 3 - i, elevation: 3 - i },
                ]}
              />
            ))}
          </View>
          <Text style={styles.label}>
            <Text style={styles.labelEmphasis}>{confirmedCount}</Text>
            {t('eventDetail.participantsConfirmedMid')}
            <Text style={styles.labelEmphasis}>{totalInvitedCount}</Text>
            {t('eventDetail.participantsConfirmedSuffix')}
          </Text>
        </View>
      </LinearGradient>
    </Button>
  );
}

const styles = StyleSheet.create({
  gradientRing: {
    alignSelf: 'center',
    borderRadius: OUTER_RADIUS,
    padding: BORDER_W,
    marginBottom: 18,
  },
  innerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    borderRadius: INNER_RADIUS,
    backgroundColor: colors.neutral.primary,
    paddingLeft: 14,
    paddingRight: 18,
    paddingVertical: 10,
    gap: 14,
  },
  avatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    flexShrink: 1,
    color: LABEL_COLOR,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fontFamilies.signikaMedium,
    fontWeight: '500',
  },
  labelEmphasis: {
    fontFamily: fontFamilies.signikaSemiBold,
    fontWeight: '700',
    color: LABEL_COLOR,
  },
});
