import { StyleSheet } from 'react-native';

import { type AppColors } from '@/constants/Colors';
import { hp, wp } from '@/utils/responsive';

export const createToastStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    position: 'absolute',
    top: hp('7%'),
    left: wp('5%'),
    right: wp('5%'),
    zIndex: 1000,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 8,
  },
  error: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  success: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  info: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});
