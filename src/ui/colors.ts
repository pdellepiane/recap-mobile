/**
 * Global color tokens for the app.
 * Use tokens here instead of hex/rgba literals in components.
 */
export const colors = {
  background: {
    primary: '#222222',
    primaryOpacity5: 'rgba(34, 34, 34, 0.5)',
    secondary: '#2A2A2A',
    tertiary: 'rgba(51, 51, 51, 1)',
    elevated: '#3D3D3D',
  },
  primary: {
    lighttest: '#FAEFEF',
  },
  neutral: {
    primary: 'rgba(255, 255, 255, 1)',
    lightest: '#FCFCFC',
    secondary: '#B3B3B3',
    tertiary: 'rgba(138, 138, 138, 1)',
    disabled: '#5C5C5C',
    /** Primary text on lime / accent CTAs (e.g. home banner “Ingresar”). */
    onLime: 'rgba(0, 0, 0, 1)',
  },
  typography: {
    subColor: '#747688',
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
  transparent: {
    white: 'rgba(255, 255, 255, 0)',
  },
  /** Countdown blocks (event detail / promos): deep purple cells, lavender border on charcoal. */
  countdown: {
    cellBackground: 'rgba(95, 43, 216, 0.5)',
  },
  /** Guess-the-answer quiz creation flow (matches design spec). */
  quizCreate: {
    /** Suggested-question cards (slightly darker than added). */
    suggestionCard: '#141414',
    /** Committed question rows before options exist. */
    addedCard: '#2C2C2E',
    /** + control before draft has text. */
    plusDisabled: '#48484A',
  },
  /** Not defined in figma colors. */
  events: {
    rankingBronze: '#B67921',
  },
} as const;

export type AppColors = typeof colors;
