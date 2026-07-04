import { DarkTheme, DefaultTheme } from '@react-navigation/native';

export const Colors = {
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#0F172A',
    mutedText: '#64748B',
    border: '#E2E8F0',
    divider: '#94A3B8',
    primary: '#2563EB',
    primaryText: '#FFFFFF',
    danger: '#DC2626',
    success: '#16A34A',
    inputBackground: '#FFFFFF',
  },
  dark: {
    background: '#0B1120',
    surface: '#111827',
    text: '#F8FAFC',
    mutedText: '#94A3B8',
    border: '#1E293B',
    divider: '#475569',
    primary: '#60A5FA',
    primaryText: '#08111F',
    danger: '#F87171',
    success: '#4ADE80',
    inputBackground: '#0F172A',
  },
} as const;

export type ColorSchemeName = keyof typeof Colors;
export type AppColors = (typeof Colors)[ColorSchemeName];

export const NavigationThemes = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors.light.primary,
      background: Colors.light.background,
      card: Colors.light.surface,
      text: Colors.light.text,
      border: Colors.light.border,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: Colors.dark.primary,
      background: Colors.dark.background,
      card: Colors.dark.surface,
      text: Colors.dark.text,
      border: Colors.dark.border,
    },
  },
} as const;
  