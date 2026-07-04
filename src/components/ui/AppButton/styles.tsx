import { StyleSheet } from 'react-native';

import { type AppColors } from '@/constants/Colors';
import { hp, wp } from '@/utils/responsive';

export const createAppButtonStyles = (colors: AppColors) => StyleSheet.create({
  button: {
    minHeight: hp('5.8%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: wp('4%'),
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  dimmed: {
    opacity: 0.7,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  primaryText: {
    color: colors.primaryText,
  },
  secondaryText: {
    color: colors.text,
  },
  dangerText: {
    color: '#FFFFFF',
  },
  ghostText: {
    color: colors.primary,
  },
});
