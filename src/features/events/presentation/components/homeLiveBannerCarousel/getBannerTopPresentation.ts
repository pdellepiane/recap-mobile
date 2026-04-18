import { HomeBannerType } from '@/src/core/api/types';
import { colors } from '@/src/ui';

export type BannerTopPresentation = {
  showLiveDot: boolean;
  label: string;
  labelColor: string;
};

/** Legacy full-bleed fallback slide only; all known `HomeBannerType` values use dedicated layouts. */
export function getBannerTopPresentation(bannerType: HomeBannerType): BannerTopPresentation {
  switch (bannerType) {
    case HomeBannerType.EventLive:
      return {
        showLiveDot: true,
        label: 'Evento en vivo',
        labelColor: colors.states.active,
      };
    case HomeBannerType.EventToStart:
      return {
        showLiveDot: false,
        label: 'Próximo evento',
        labelColor: colors.accent[400],
      };
    case HomeBannerType.EventFinished:
      return {
        showLiveDot: false,
        label: 'Evento finalizado',
        labelColor: colors.neutral.secondary,
      };
    case HomeBannerType.NoEvent:
      return {
        showLiveDot: false,
        label: 'Evento',
        labelColor: colors.neutral.primary,
      };
  }
}
