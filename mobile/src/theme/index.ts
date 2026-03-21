// ─── Design Tokens — Dark Premium Theme ──────────────────────────────────────

export const Colors = {
  // ── Backgrounds ─────────────────────────────────────────────────────────────
  background:          '#0D0D1A',
  backgroundAlt:       '#111120',
  surface:             '#161628',
  card:                '#1C1C32',
  cardHighlight:       '#242440',
  overlay:             'rgba(0,0,0,0.7)',

  // ── Brand Purple ─────────────────────────────────────────────────────────────
  primary:             '#7C3AED',
  primaryLight:        '#A78BFA',
  primaryDark:         '#5B21B6',
  primaryGradient:     ['#8B5CF6', '#6D28D9'] as [string, string],
  primaryGlow:         'rgba(139,92,246,0.35)',

  // ── Accent Teal ──────────────────────────────────────────────────────────────
  accent:              '#06D6A0',
  accentLight:         '#34EFC4',
  accentGradient:      ['#06D6A0', '#0EA5E9'] as [string, string],
  accentGlow:          'rgba(6,214,160,0.25)',

  // ── Borders ──────────────────────────────────────────────────────────────────
  border:              'rgba(255,255,255,0.07)',
  borderActive:        'rgba(255,255,255,0.18)',
  borderSubtle:        'rgba(255,255,255,0.04)',

  // ── Text ─────────────────────────────────────────────────────────────────────
  text:                '#FFFFFF',
  textSecondary:       'rgba(255,255,255,0.62)',
  textMuted:           'rgba(255,255,255,0.35)',
  textDisabled:        'rgba(255,255,255,0.18)',
  textInverse:         '#0D0D1A',

  // ── Semantic ─────────────────────────────────────────────────────────────────
  success:             '#06D6A0',
  successBg:           'rgba(6,214,160,0.12)',
  warning:             '#FBBF24',
  warningBg:           'rgba(251,191,36,0.12)',
  error:               '#F87171',
  errorBg:             'rgba(248,113,113,0.12)',
  info:                '#38BDF8',
  infoBg:              'rgba(56,189,248,0.12)',

  // ── RIASEC Dimensions ────────────────────────────────────────────────────────
  riasec: {
    R: '#FBBF24',   // Realista      — Amber
    I: '#38BDF8',   // Investigativo — Sky
    A: '#E879F9',   // Artístico     — Fuchsia
    S: '#34D399',   // Social        — Emerald
    E: '#F87171',   // Empreendedor  — Rose
    C: '#818CF8',   // Convencional  — Indigo
  } as Record<string, string>,

  riasecBg: {
    R: 'rgba(251,191,36,0.12)',
    I: 'rgba(56,189,248,0.12)',
    A: 'rgba(232,121,249,0.12)',
    S: 'rgba(52,211,153,0.12)',
    E: 'rgba(248,113,113,0.12)',
    C: 'rgba(129,140,248,0.12)',
  } as Record<string, string>,

  riasecGradient: {
    R: ['#F59E0B', '#FBBF24'] as [string, string],
    I: ['#0EA5E9', '#38BDF8'] as [string, string],
    A: ['#D946EF', '#E879F9'] as [string, string],
    S: ['#059669', '#34D399'] as [string, string],
    E: ['#DC2626', '#F87171'] as [string, string],
    C: ['#4F46E5', '#818CF8'] as [string, string],
  } as Record<string, [string, string]>,

  // ── Big Five ─────────────────────────────────────────────────────────────────
  big5: {
    extraversion:      '#FB923C',
    agreeableness:     '#34D399',
    conscientiousness: '#818CF8',
    neuroticism:       '#F87171',
    openness:          '#E879F9',
  },

  // ── Tab Bar ──────────────────────────────────────────────────────────────────
  tabActive:           '#A78BFA',
  tabInactive:         'rgba(255,255,255,0.32)',
  tabBackground:       '#13131F',
  tabBorder:           'rgba(255,255,255,0.06)',
};

export const Spacing = {
  xs:   4,
  sm:   8,
  md:   16,
  lg:   24,
  xl:   32,
  xxl:  48,
  xxxl: 64,
};

export const Radius = {
  xs:   6,
  sm:   10,
  md:   14,
  lg:   20,
  xl:   28,
  xxl:  36,
  full: 9999,
};

export const Typography = {
  xs:    11,
  sm:    13,
  base:  15,
  lg:    17,
  xl:    20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 38,
  '5xl': 48,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  primary: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  accent: {
    shadowColor: '#06D6A0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
};
