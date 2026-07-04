import { StyleSheet } from 'react-native';

import { type AppColors } from '@/constants/Colors';
import { hp, wp } from '@/utils/responsive';

export const createAppTextInputStyles = (colors: AppColors) => StyleSheet.create({
  field: {
    gap: hp('1%'),
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    minHeight: hp('5.8%'),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBackground,
    color: colors.text,
    paddingHorizontal: wp('3.6%'),
    paddingVertical: hp('1.4%'),
    fontSize: 16,
  },
  inputWithToggle: {
    paddingRight: wp('13%'),
  },
  multiline: {
    minHeight: hp('11%'),
    textAlignVertical: 'top',
  },
  passwordToggle: {
    position: 'absolute',
    right: wp('2.5%'),
    top: 0,
    bottom: 0,
    width: wp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
