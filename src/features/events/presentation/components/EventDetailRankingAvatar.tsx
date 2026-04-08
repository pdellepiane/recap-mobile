import type { RankingRow } from '../data/eventRanking';
import { colors } from '@/src/ui';
import { Image, StyleSheet, Text, View } from 'react-native';

const AVATAR = 44;

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return `${parts[0]!.charAt(0)}${parts[1]!.charAt(0)}`.toUpperCase();
}

export function EventDetailRankingAvatar({ row }: { row: RankingRow }) {
  const letters = row.initials ?? initialsFromName(row.name);

  if (row.avatarUrl) {
    return <Image source={{ uri: row.avatarUrl }} style={styles.avatar} />;
  }

  return (
    <View style={[styles.avatar, styles.avatarInitials]}>
      <Text style={styles.avatarInitialsText}>{letters}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
  },
  avatarInitials: {
    backgroundColor: colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitialsText: {
    color: colors.neutral.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});
