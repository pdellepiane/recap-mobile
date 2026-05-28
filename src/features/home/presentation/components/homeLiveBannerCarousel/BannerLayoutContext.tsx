import { deriveBannerLayout, type BannerLayoutMetrics } from './layout';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useWindowDimensions } from 'react-native';

const BannerLayoutContext = createContext<BannerLayoutMetrics | null>(null);

export function BannerLayoutProvider({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();
  const layout = useMemo(() => deriveBannerLayout(width), [width]);
  return <BannerLayoutContext.Provider value={layout}>{children}</BannerLayoutContext.Provider>;
}

export function useBannerLayout(): BannerLayoutMetrics {
  const layout = useContext(BannerLayoutContext);
  if (!layout) {
    throw new Error('useBannerLayout must be used within BannerLayoutProvider');
  }
  return layout;
}
