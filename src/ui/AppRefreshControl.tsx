import { colors } from './colors';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { Platform, RefreshControl, type RefreshControlProps } from 'react-native';

/** accent[500] as hex — Fabric UIRefreshControl ignores `rgba()` and initial `tintColor`. */
const REFRESH_SPINNER_TINT = '#CCFF2D';
/** Near-identical stub so Fabric registers a tint change without a visible flash. */
const IOS_TINT_STUB = '#CBFE2C';

type Props = Pick<RefreshControlProps, 'refreshing' | 'onRefresh'>;

function scheduleIosTintApply(setTint: (value: string) => void): () => void {
  setTint(IOS_TINT_STUB);
  let raf2 = 0;
  const raf1 = requestAnimationFrame(() => {
    raf2 = requestAnimationFrame(() => setTint(REFRESH_SPINNER_TINT));
  });
  return () => {
    cancelAnimationFrame(raf1);
    cancelAnimationFrame(raf2);
  };
}

/**
 * Pull-to-refresh with accent spinner tint.
 * Fabric iOS only applies `tintColor` after a post-mount change — re-run on focus and remount.
 */
export function AppRefreshControl({ refreshing, onRefresh }: Props) {
  const [iosKey, setIosKey] = useState(0);
  const [iosTintColor, setIosTintColor] = useState(REFRESH_SPINNER_TINT);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'ios') {
        return;
      }
      setIosKey((key) => key + 1);
    }, []),
  );

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }
    return scheduleIosTintApply(setIosTintColor);
  }, [iosKey]);

  return (
    <RefreshControl
      key={Platform.OS === 'ios' ? `app-refresh-${iosKey}` : 'app-refresh'}
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={Platform.OS === 'ios' ? iosTintColor : REFRESH_SPINNER_TINT}
      colors={[REFRESH_SPINNER_TINT]}
      progressBackgroundColor={colors.background.primary}
    />
  );
}
