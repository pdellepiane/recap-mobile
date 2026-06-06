import { formatEventDetailOverviewDateLines } from '../../../data/eventDetailOverviewDate';
import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { memo, useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type Props = {
  eventDateIso?: string | null;
};

export const EventDetailOverviewDateCard = memo(function EventDetailOverviewDateCard({
  eventDateIso,
}: Props) {
  const { i18n } = useTranslation();
  const { dateLine, timeLine, a11y } = useMemo(() => {
    const lines = formatEventDetailOverviewDateLines(eventDateIso, i18n.language);
    return {
      ...lines,
      a11y: lines.timeLine ? `${lines.dateLine}, ${lines.timeLine}` : lines.dateLine,
    };
  }, [eventDateIso, i18n.language]);

  return (
    <View style={styles.infoCard} accessibilityLabel={a11y}>
      <View style={styles.iconWell}>
        <Image
          source={images.eventDetail.icons.date}
          style={styles.infoCardIcon}
          resizeMode="contain"
        />
      </View>
      <View style={styles.infoCardText}>
        <Text style={styles.infoCardTitle}>{dateLine}</Text>
        {timeLine ? <Text style={styles.infoCardSubtitle}>{timeLine}</Text> : null}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  iconWell: {
    width: 64,
    height: 64,
    borderRadius: 16,
    padding: 16,
    backgroundColor: colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCardIcon: {
    width: 28,
    height: 28,
  },
  infoCardText: {
    flex: 1,
  },
  infoCardTitle: {
    color: colors.neutral.lightest,
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
    fontFamily: fontFamilies.signikaRegular,
  },
  infoCardSubtitle: {
    color: colors.neutral.lightest,
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 16,
    fontFamily: fontFamilies.signikaLight,
    marginTop: 2,
  },
});
