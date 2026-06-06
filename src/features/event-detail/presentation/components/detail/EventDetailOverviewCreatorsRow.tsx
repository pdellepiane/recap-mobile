import { useTranslation } from '@/src/i18n';
import { colors, HostInitialsAvatar, parseHostsFromLine } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  hostsLine: string;
};

export const EventDetailOverviewCreatorsRow = memo(function EventDetailOverviewCreatorsRow({
  hostsLine,
}: Props) {
  const { t } = useTranslation();
  const hostNames = useMemo(() => parseHostsFromLine(hostsLine), [hostsLine]);

  return (
    <View style={styles.creatorsRow}>
      <View style={styles.creatorAvatars}>
        {hostNames.map((name, i) => (
          <HostInitialsAvatar
            key={`${name}-${i}`}
            fullName={name}
            colorIndex={i}
            style={
              i > 0
                ? { marginLeft: -14, zIndex: hostNames.length - i }
                : { zIndex: hostNames.length }
            }
          />
        ))}
      </View>
      <View style={styles.creatorsTextCol}>
        <Text style={styles.creatorsLabel}>{t('eventDetail.creatorsLabel')}</Text>
        <Text style={styles.creatorsNames}>{hostsLine}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  creatorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 28,
  },
  creatorAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorsTextCol: {
    flex: 1,
  },
  creatorsLabel: {
    color: colors.neutral.secondary,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontFamilies.signikaLight,
    fontWeight: '300',
  },
  creatorsNames: {
    color: colors.neutral.primary,
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
    fontFamily: fontFamilies.signikaRegular,
    marginTop: 2,
  },
});
