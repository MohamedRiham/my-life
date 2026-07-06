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
  subtaskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp('3%'),
  },
  subtaskSummary: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: hp('0.4%'),
  },
  subtaskForm: {
    gap: hp('1.2%'),
  },
  subtaskList: {
    gap: hp('1%'),
  },
  subtaskItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: wp('3%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1.2%'),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBackground,
  },
  subtaskCheckbox: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subtaskCheckboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  subtaskTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  subtaskTitleCompleted: {
    opacity: 0.5,
    textDecorationLine: 'line-through',
  },
  subtaskDeleteButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
});
