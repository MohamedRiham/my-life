import { StyleSheet } from 'react-native';

import { type AppColors } from '@/constants/Colors';
import { hp, wp } from '@/utils/responsive';

export const createAppScreenStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('3%'),
  },
});
