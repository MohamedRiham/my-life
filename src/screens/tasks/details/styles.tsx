import { StyleSheet } from 'react-native';

import { type AppColors } from '@/constants/Colors';
import { hp, wp } from '@/utils/responsive';

export const createTaskDetailsStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    gap: hp('2%'),
  },
  loadingText: {
    color: colors.mutedText,
    fontSize: 16,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: wp('3%'),
    justifyContent: 'space-between',
  },
  titleGroup: {
    flex: 1,
    gap: hp('0.8%'),
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  status: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: colors.inputBackground,
  },
  iconButtonPressed: {
    opacity: 0.7,
  },
  section: {
    gap: hp('0.8%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.8%'),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  label: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  value: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 23,
  },
});
