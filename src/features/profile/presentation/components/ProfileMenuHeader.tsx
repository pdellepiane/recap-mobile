import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text, View } from 'react-native';

type ProfileMenuHeaderProps = {
  displayName: string;
  initials: string;
};

export function ProfileMenuHeader({ displayName, initials }: ProfileMenuHeaderProps) {
  return (
    <View style={styles.root}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <Text style={styles.userName}>{displayName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 40,
    paddingBottom: 30,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.states.warning,
  },
  avatarText: {
    fontFamily: fontFamilies.signikaSemiBold,
    fontSize: 36,
    color: colors.background.primary,
  },
  userName: {
    fontFamily: fontFamilies.medium,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '500',
    color: colors.neutral.primary,
    textAlign: 'center',
  },
});
