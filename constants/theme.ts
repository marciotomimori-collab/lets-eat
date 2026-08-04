import { Colors } from './colors';
import { TextStyle } from 'react-native';

// ─── Font Family ────────────────────────────────────────
export const FontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

// ─── Font Sizes ─────────────────────────────────────────
export const FontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
};

// ─── Line Heights ───────────────────────────────────────
export const LineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

// ─── Composable Text Styles ─────────────────────────────
// These can be spread into StyleSheet: `...Typography.h1`
export const Typography: Record<string, TextStyle> & {
  fontFamily: typeof FontFamily;
  sizes: typeof FontSizes;
  lineHeights: typeof LineHeights;
} = {
  // Keep the raw values accessible
  fontFamily: FontFamily,
  sizes: FontSizes,
  lineHeights: LineHeights,

  // Headings
  display: {
    fontFamily: FontFamily.bold,
    fontSize: FontSizes.display,
    lineHeight: FontSizes.display * LineHeights.tight,
  },
  h1: {
    fontFamily: FontFamily.bold,
    fontSize: FontSizes.xxxl,
    lineHeight: FontSizes.xxxl * LineHeights.tight,
  },
  h2: {
    fontFamily: FontFamily.bold,
    fontSize: FontSizes.xxl,
    lineHeight: FontSizes.xxl * LineHeights.tight,
  },
  h3: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSizes.xl,
    lineHeight: FontSizes.xl * LineHeights.normal,
  },
  h4: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSizes.lg,
    lineHeight: FontSizes.lg * LineHeights.normal,
  },

  // Body
  body: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.md,
    lineHeight: FontSizes.md * LineHeights.normal,
  },
  body1: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.md,
    lineHeight: FontSizes.md * LineHeights.normal,
  },
  body2: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.sm,
    lineHeight: FontSizes.sm * LineHeights.normal,
  },

  // Small
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: FontSizes.xs,
    lineHeight: FontSizes.xs * LineHeights.normal,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: FontSizes.sm,
    lineHeight: FontSizes.sm * LineHeights.normal,
  },
};

// ─── Spacing ────────────────────────────────────────────
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  section: 40,

  // Aliases for subagent compatibility
  s: 8,
  m: 12,
  l: 16,
};

// ─── Border Radius ──────────────────────────────────────
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

// ─── Shadows ────────────────────────────────────────────
export const Shadows = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
};
