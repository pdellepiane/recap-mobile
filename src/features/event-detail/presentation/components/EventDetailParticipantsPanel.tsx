import type { EventDetailParticipantRow } from './EventDetailParticipantTypes';
import { EventDetailParticipantsList } from './EventDetailParticipantsList';
import { EventDetailParticipantsPublicListSwitch } from './EventDetailParticipantsPublicListSwitch';
import { useTranslation } from '@/src/i18n';
import { CloseButton, colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type { EventDetailParticipantRow } from './EventDetailParticipantTypes';

type Props = {
  participants: EventDetailParticipantRow[];
  isPublicListEnabled: boolean;
  onTogglePublicList: (next: boolean) => void;
  onClose: () => void;
};

/** Full-screen participants UI (used from event stack modal route). */
export function EventDetailParticipantsPanel({
  participants,
  isPublicListEnabled,
  onTogglePublicList,
  onClose,
}: Props) {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <CloseButton
        onPress={onClose}
        style={styles.closeBtn}
        accessibilityLabel={t('common.close')}
      />

      <Text style={styles.title}>{t('eventDetail.participantsModalTitle')}</Text>

      <EventDetailParticipantsPublicListSwitch
        title={t('eventDetail.publicParticipantListTitle')}
        body={t('eventDetail.publicParticipantListBody')}
        value={isPublicListEnabled}
        onValueChange={onTogglePublicList}
      />

      <View style={styles.separator} />

      <EventDetailParticipantsList
        participants={participants}
        listTitle={t('eventDetail.participantListSectionTitle')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingHorizontal: 18,
  },
  closeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  title: {
    color: colors.neutral.lightest,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '400',
    fontFamily: fontFamilies.signikaRegular,
    marginTop: 12,
    marginBottom: 24,
  },
  separator: {
    height: 1,
    backgroundColor: colors.neutral.disabled,
    marginHorizontal: -18,
    marginBottom: 18,
  },
});
