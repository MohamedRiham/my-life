import { StyleSheet } from 'react-native';

import { type AppColors } from '@/constants/Colors';
import { hp, wp } from '@/utils/responsive';

export const createDrawerStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hp('2%'),
  },
  profile: {
    gap: hp('0.5%'),
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  name: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  email: {
    color: colors.mutedText,
    fontSize: 14,
  },
  footer: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: hp('1%'),
  },
  logoutLabel: {
    color: colors.danger,
    fontWeight: '700',
  },
});
