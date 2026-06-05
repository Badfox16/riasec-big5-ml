// ─── Design Tokens — Dual Theme (Dark / Light) ────────────────────────────────

// ── Semantic colours that never change between themes ─────────────────────────
const _riasec = {
  R: '#FBBF24', I: '#38BDF8', A: '#E879F9',
  S: '#34D399', E: '#F87171', C: '#818CF8',
} as Record<string, string>;

const _riasecBg = {
  R: 'rgba(251,191,36,0.12)',  I: 'rgba(56,189,248,0.12)',
  A: 'rgba(232,121,249,0.12)', S: 'rgba(52,211,153,0.12)',
  E: 'rgba(248,113,113,0.12)', C: 'rgba(129,140,248,0.12)',
} as Record<string, string>;

const _riasecGradient = {
  R: ['#F59E0B', '#FBBF24'] as [string, string],
  I: ['#0EA5E9', '#38BDF8'] as [string, string],
  A: ['#D946EF', '#E879F9'] as [string, string],
  S: ['#059669', '#34D399'] as [string, string],
  E: ['#DC2626', '#F87171'] as [string, string],
  C: ['#4F46E5', '#818CF8'] as [string, string],
} as Record<string, [string, string]>;

const _big5 = {
  extraversion:      '#FB923C',
  agreeableness:     '#34D399',
  conscientiousness: '#22D3EE',
  neuroticism:       '#F87171',
  openness:          '#E879F9',
};

// ── Dark theme ────────────────────────────────────────────────────────────────
export const darkColors = {
  background:      '#06101F',
  backgroundAlt:   '#0A1628',
  surface:         '#0D1E33',
  card:            '#122540',
  cardHighlight:   '#173050',
  overlay:         'rgba(0,0,0,0.7)',

  primary:         '#06B6D4',
  primaryLight:    '#67E8F9',
  primaryDark:     '#0891B2',
  primaryGradient: ['#22D3EE', '#0891B2'] as [string, string],
  primaryGlow:     'rgba(6,182,212,0.35)',

  accent:          '#E0F7FA',
  accentLight:     '#FFFFFF',
  accentGradient:  ['#67E8F9', '#F0F9FF'] as [string, string],
  accentGlow:      'rgba(224,247,250,0.2)',

  border:          'rgba(6,182,212,0.18)',
  borderActive:    'rgba(6,182,212,0.45)',
  borderSubtle:    'rgba(6,182,212,0.07)',

  text:            '#F0F9FF',
  textSecondary:   'rgba(240,249,255,0.65)',
  textMuted:       'rgba(240,249,255,0.38)',
  textDisabled:    'rgba(240,249,255,0.2)',
  textInverse:     '#06101F',

  success:         '#34D399',
  successBg:       'rgba(52,211,153,0.12)',
  warning:         '#FBBF24',
  warningBg:       'rgba(251,191,36,0.12)',
  error:           '#F87171',
  errorBg:         'rgba(248,113,113,0.12)',
  info:            '#22D3EE',
  infoBg:          'rgba(34,211,238,0.12)',

  riasec:          _riasec,
  riasecBg:        _riasecBg,
  riasecGradient:  _riasecGradient,
  big5:            _big5,

  tabActive:       '#22D3EE',
  tabInactive:     'rgba(240,249,255,0.32)',
  tabBackground:   '#091422',
  tabBorder:       'rgba(6,182,212,0.12)',

  heroGradient:    ['#13102E', '#0D0D1A'] as [string, string],
  authGradient:    ['#0D0D1A', '#13102E', '#0D0D1A'] as [string, string, string],
};

// ── Light theme ───────────────────────────────────────────────────────────────
export const lightColors = {
  background:      '#F8FAFC',
  backgroundAlt:   '#EFF6FF',
  surface:         '#FFFFFF',
  card:            '#FFFFFF',
  cardHighlight:   '#EFF6FF',
  overlay:         'rgba(0,0,0,0.4)',

  primary:         '#0891B2',
  primaryLight:    '#06B6D4',
  primaryDark:     '#0E7490',
  primaryGradient: ['#0891B2', '#06B6D4'] as [string, string],
  primaryGlow:     'rgba(8,145,178,0.12)',

  accent:          '#0E7490',
  accentLight:     '#0891B2',
  accentGradient:  ['#0891B2', '#22D3EE'] as [string, string],
  accentGlow:      'rgba(14,116,144,0.08)',

  border:          'rgba(8,145,178,0.2)',
  borderActive:    'rgba(8,145,178,0.45)',
  borderSubtle:    'rgba(8,145,178,0.08)',

  text:            '#0F172A',
  textSecondary:   'rgba(15,23,42,0.6)',
  textMuted:       'rgba(15,23,42,0.38)',
  textDisabled:    'rgba(15,23,42,0.2)',
  textInverse:     '#FFFFFF',

  success:         '#059669',
  successBg:       'rgba(5,150,105,0.1)',
  warning:         '#D97706',
  warningBg:       'rgba(217,119,6,0.1)',
  error:           '#DC2626',
  errorBg:         'rgba(220,38,38,0.1)',
  info:            '#0891B2',
  infoBg:          'rgba(8,145,178,0.1)',

  riasec:          _riasec,
  riasecBg:        _riasecBg,
  riasecGradient:  _riasecGradient,
  big5:            _big5,

  tabActive:       '#0891B2',
  tabInactive:     'rgba(15,23,42,0.35)',
  tabBackground:   '#FFFFFF',
  tabBorder:       'rgba(8,145,178,0.15)',

  heroGradient:    ['#E8F4F8', '#F8FAFC'] as [string, string],
  authGradient:    ['#F8FAFC', '#EFF6FF', '#F8FAFC'] as [string, string, string],
};

// Backward-compat static export (used by data/questions.ts at module level)
export const Colors = darkColors;

export type ColorsType = typeof darkColors;

// ── Hook ──────────────────────────────────────────────────────────────────────
import { useThemeStore } from '../store/useThemeStore';
export function useColors(): ColorsType {
  const isDark = useThemeStore(s => s.isDark);
  return isDark ? darkColors : lightColors;
}

// ── Spacing / Radius / Typography / Shadow (unchanged) ────────────────────────
export const Spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64,
};

export const Radius = {
  xs: 6, sm: 10, md: 14, lg: 20, xl: 28, xxl: 36, full: 9999,
};

export const Typography = {
  xs: 11, sm: 13, base: 15, lg: 17, xl: 20,
  '2xl': 24, '3xl': 30, '4xl': 38, '5xl': 48,
};

export const Shadow = {
  sm: {
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25, shadowRadius: 6, elevation: 3,
  },
  md: {
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 14, elevation: 6,
  },
  lg: {
    shadowColor: '#000', shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4, shadowRadius: 24, elevation: 12,
  },
  primary: {
    shadowColor: '#06B6D4', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5, shadowRadius: 20, elevation: 10,
  },
  accent: {
    shadowColor: '#67E8F9', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
  },
};
