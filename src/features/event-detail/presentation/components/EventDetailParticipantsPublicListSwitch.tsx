import { colors, Switch } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  body: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
};

export function EventDetailParticipantsPublicListSwitch({
  title,
  body,
  value,
  onValueChange,
}: Props) {
  return (
    <View style={styles.switchSection}>
      <View style={styles.switchTextCol}>
        <Text style={styles.switchTitle}>{title}</Text>
        <Text style={styles.switchBody}>{body}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  switchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  switchTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  switchTitle: {
    color: colors.neutral.primary,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    fontFamily: fontFamilies.signikaSemiBold,
    marginBottom: 4,
  },
  switchBody: {
    color: colors.neutral.lightest,
    fontSize: 14,
    fontWeight: '300',
    lineHeight: 20,
    fontFamily: fontFamilies.signikaLight,
  },
});
