/**
 * Global color tokens for the app.
 * Use tokens here instead of hex/rgba literals in components.
 */
export const colors = {
  background: {
    primary: 'rgba(34, 34, 34, 1)',
    secondary: 'rgba(42, 42, 42, 1)',
    tertiary: 'rgba(51, 51, 51, 1)',
    elevated: 'rgba(61, 61, 61, 1)',
  },
  neutral: {
    primary: 'rgba(255, 255, 255, 1)',
    lightest: '#FCFCFC',
    secondary: 'rgba(179, 179, 179, 1)',
    tertiary: 'rgba(138, 138, 138, 1)',
    disabled: 'rgba(92, 92, 92, 1)',
    /** Primary text on lime / accent CTAs (e.g. home banner “Ingresar”). */
    onLime: 'rgba(0, 0, 0, 1)',
  },
  brand: {
    700: 'rgba(95, 43, 216, 1)',
    600: 'rgba(111, 51, 232, 1)',
    500: 'rgba(137, 66, 254, 1)',
    400: 'rgba(162, 108, 255, 1)',
    300: 'rgba(195, 166, 255, 1)',
    200: 'rgba(212, 205, 255, 1)',
  },
  accent: {
    700: 'rgba(143, 191, 30, 1)',
    750: 'rgba(143, 191, 30, 0.5)',
    600: 'rgba(169, 224, 36, 1)',
    500: 'rgba(204, 255, 45, 1)',
    400: 'rgba(216, 255, 90, 1)',
    300: 'rgba(231, 255, 154, 1)',
    200: 'rgba(242, 255, 208, 1)',
  },
  states: {
    error: 'rgba(255, 77, 109, 1)',
    warning: 'rgba(255, 184, 0, 1)',
    active: 'rgba(169, 224, 36, 1)',
  },
  overlay: {
    black70: 'rgba(0, 0, 0, 0.7)',
    black55: 'rgba(0, 0, 0, 0.55)',
    black45: 'rgba(0, 0, 0, 0.45)',
    black35: 'rgba(0, 0, 0, 0.35)',
    black08: 'rgba(0, 0, 0, 0.08)',
    blackControl72: 'rgba(40, 40, 40, 0.72)',
    gray90: 'rgba(60, 60, 60, 0.9)',
    white85: 'rgba(255, 255, 255, 0.85)',
    white60: 'rgba(255, 255, 255, 0.6)',
    white50: 'rgba(255, 255, 255, 0.5)',
    white35: 'rgba(255, 255, 255, 0.35)',
    white22: 'rgba(255, 255, 255, 0.22)',
    white20: 'rgba(255, 255, 255, 0.2)',
    white08: 'rgba(255, 255, 255, 0.08)',
    white06: 'rgba(255, 255, 255, 0.06)',
    white55: 'rgba(255, 255, 255, 0.55)',
    white65: 'rgba(255, 255, 255, 0.65)',
  },
  /** Countdown blocks (event detail / promos): deep purple cells, lavender border on charcoal. */
  countdown: {
    cellBackground: 'rgba(72, 40, 128, 1)',
    cellBorder: 'rgba(123, 82, 171, 1)',
  },
  /** Event detail screen & home feed accents (quiz label, ranking medals, carousel dots, etc.). */
  events: {
    challengeQuizLabel: 'rgba(196, 181, 253, 1)',
    challengesDot: 'rgba(244, 114, 182, 1)',
    rankingGold: 'rgba(212, 175, 55, 1)',
    rankingSilver: 'rgba(142, 142, 142, 1)',
    rankingBronze: 'rgba(169, 113, 66, 1)',
    rankingRowHighlight: 'rgba(44, 44, 46, 1)',
    carouselDotInactive: 'rgba(63, 63, 70, 1)',
    guestsOnCard: 'rgba(196, 181, 253, 1)',
    locationPin: 'rgba(167, 139, 250, 1)',
    /** Home carousel “Evento en vivo” row. */
    homeCardLive: 'rgba(163, 207, 61, 1)',
    homeCardLiveHalo: 'rgba(163, 207, 61, 0.38)',
    /** Teal host / “Por ti” chip on card cover. */
    homeCardCoverTeal: 'rgba(46, 196, 182, 1)',
    homeCardCoverOnTeal: 'rgba(15, 31, 26, 1)',
    /** Pastel facepile fills (home carousel). */
    homeCardPastelMint: 'rgba(184, 232, 208, 1)',
    homeCardPastelSky: 'rgba(184, 217, 240, 1)',
    homeCardPastelLilac: 'rgba(212, 196, 240, 1)',
  },
} as const;

export type AppColors = typeof colors;
