import { colors } from './colors';
import { fontFamilies } from './typography';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

type CountdownTimerProps = {
  endsAt: Date;
  cellBackgroundColor?: string;
  cellBorderColor?: string;
  textColor?: string;
};

/**
 * Shared countdown renderer (days/hours/minutes/seconds).
 * Pixel-matched: rounded square cells, deep purple fill, lavender border.
 */
export function CountdownTimer({
  endsAt,
  cellBackgroundColor = colors.countdown.cellBackground,
  cellBorderColor = colors.countdown.cellBorder,
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
    { value: days > 99 ? String(days) : pad2(days), label: 'días' },
    { value: pad2(hours), label: 'horas' },
    { value: pad2(minutes), label: 'minutos' },
    { value: pad2(seconds), label: 'segundos' },
  ];

  return (
    <View style={styles.row}>
      {cells.map((c) => (
        <View
          key={c.label}
          style={[
            styles.cell,
            {
              backgroundColor: cellBackgroundColor,
              borderColor: cellBorderColor,
            },
          ]}
        >
          <Text style={[styles.value, { color: textColor }]} numberOfLines={1}>
            {c.value}
          </Text>
          <Text style={[styles.label, { color: textColor }]} numberOfLines={1}>
            {c.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const CELL_GAP = 10;
const CELL_RADIUS = 18;
const CELL_BORDER = 1;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: CELL_GAP,
    marginTop: 8,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    minWidth: 0,
    borderRadius: CELL_RADIUS,
    borderWidth: CELL_BORDER,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
    fontFamily: fontFamilies.signikaRegular,
  },
  label: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 16,
    fontFamily: fontFamilies.signikaLight,
    marginTop: 6,
    textAlign: 'center',
  },
});
