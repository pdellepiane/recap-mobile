import type { EventDetailParticipantRow } from './EventDetailParticipantTypes';
import { useTranslation } from '@/src/i18n';
import { colors, HostInitialsAvatar } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type Props = {
  participants: EventDetailParticipantRow[];
  listTitle: string;
};

export function EventDetailParticipantsList({ participants, listTitle }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <Text style={styles.listTitle}>{listTitle}</Text>
      <ScrollView style={styles.listScroll} contentContainerStyle={styles.listScrollContent}>
        {participants.map((row, index) => (
          <View
            key={row.id}
            style={[styles.participantRow, index > 0 && styles.participantRowSpacing]}
          >
            <HostInitialsAvatar fullName={row.name} colorIndex={index} size={38} />
            <Text style={styles.participantName} numberOfLines={1}>
              {row.name}
            </Text>
            <View
              style={[
                styles.statusPill,
                row.status === 'confirmed' ? styles.statusPillConfirmed : styles.statusPillPending,
              ]}
            >
              <Text
                style={[
                  styles.statusPillText,
                  row.status === 'confirmed'
                    ? styles.statusPillTextConfirmed
                    : styles.statusPillTextPending,
                ]}
              >
                {row.status === 'confirmed'
                  ? t('eventDetail.participantStatusConfirmed')
                  : t('eventDetail.participantStatusPending')}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  listTitle: {
    color: colors.neutral.lightest,
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
    fontFamily: fontFamilies.signikaRegular,
    marginBottom: 16,
  },
  listScroll: {
    flex: 1,
  },
  listScrollContent: {
    paddingBottom: 24,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantRowSpacing: {
    marginTop: 14,
  },
  participantName: {
    flex: 1,
    marginLeft: 12,
    color: colors.neutral.primary,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 24,
    fontFamily: fontFamilies.signikaRegular,
  },
  statusPill: {
    minWidth: 108,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  statusPillConfirmed: {
    borderColor: colors.states.active,
  },
  statusPillPending: {
    borderColor: colors.states.warning,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 16,
    fontFamily: fontFamilies.signikaLight,
  },
  statusPillTextConfirmed: {
    color: colors.states.active,
  },
  statusPillTextPending: {
    color: colors.states.warning,
  },
});
