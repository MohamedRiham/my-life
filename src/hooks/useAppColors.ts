import { useColorScheme } from 'react-native';

import { Colors, type ColorSchemeName } from '@/constants/Colors';

export function useAppColorScheme(): ColorSchemeName {
  return useColorScheme() === 'dark' ? 'dark' : 'light';
}

export function useAppColors() {
  return Colors[useAppColorScheme()];
}
