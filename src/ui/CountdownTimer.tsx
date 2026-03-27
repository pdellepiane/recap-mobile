import { colors } from './colors';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

type CountdownTimerProps = {
  endsAt: Date;
  cellBackgroundColor?: string;
  textColor?: string;
};

/**
 * Shared countdown renderer (days/hours/minutes/seconds).
 */
export function CountdownTimer({
  endsAt,
  cellBackgroundColor = colors.brand[700],
  textColor = colors.neutral.primary,
}: CountdownTimerProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const { days, hours, minutes, seconds } = useMemo(() => {
    const diff = Math.max(0, endsAt.getTime() - now);
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { days: d, hours: h, minutes: m, seconds: s };
  }, [endsAt, now]);

  const cells = [
    { value: pad2(days), label: 'dias' },
    { value: pad2(hours), label: 'horas' },
    { value: pad2(minutes), label: 'minutos' },
    { value: pad2(seconds), label: 'segundos' },
  ];

  return (
    <View style={styles.row}>
      {cells.map((c) => (
        <View key={c.label} style={[styles.cell, { backgroundColor: cellBackgroundColor }]}>
          <Text style={[styles.value, { color: textColor }]}>{c.value}</Text>
          <Text style={[styles.label, { color: textColor }]}>{c.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 8,
  },
  cell: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    minWidth: 0,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
  },
  label: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
    opacity: 0.95,
  },
});
