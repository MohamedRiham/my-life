import { StyleSheet } from 'react-native';

import { type AppColors } from '@/constants/Colors';
import { hp, wp } from '@/utils/responsive';

export const createAddTaskStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    gap: hp('2.4%'),
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 15,
    lineHeight: 22,
  },
  formCard: {
    gap: hp('1.8%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  dateGroup: {
    gap: hp('1.2%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1.4%'),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBackground,
  },
  dateHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp('3%'),
  },
  dateLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  dateValue: {
    color: colors.mutedText,
    fontSize: 14,
    marginTop: hp('0.4%'),
  },
  dateActions: {
    flexDirection: 'row',
    gap: wp('3%'),
  },
  dateAction: {
    flex: 1,
  },
  clearButton: {
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.8%'),
    borderRadius: 8,
  },
  clearButtonPressed: {
    opacity: 0.7,
  },
  clearButtonText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '700',
  },
  inlinePicker: {
    gap: hp('1%'),
  },
});
