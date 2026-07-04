import { StyleSheet } from 'react-native';

import { type AppColors } from '@/constants/Colors';
import { hp, wp } from '@/utils/responsive';

export const createTaskStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    gap: hp('2.4%'),
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp('4%'),
  },
  greeting: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 15,
  },
  metaText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  listContent: {
    gap: hp('1.4%'),
    paddingBottom: hp('10%'),
  },
  taskCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: wp('3%'),
    paddingHorizontal: wp('3.6%'),
    paddingVertical: hp('1.7%'),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  checkbox: {
    width: wp('7%'),
    height: wp('7%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  taskContent: {
    flex: 1,
    gap: hp('0.5%'),
  },
  taskTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  taskDescription: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
  },
  taskSchedule: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  iconButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: colors.inputBackground,
  },
  iconButtonPressed: {
    opacity: 0.7,
  },
  completedText: {
    opacity: 0.5,
    textDecorationLine: 'line-through',
  },
  emptyState: {
    alignItems: 'center',
    gap: hp('1%'),
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('3%'),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  emptyText: {
    color: colors.mutedText,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: wp('3%'),
    bottom: hp('2.4%'),
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 29,
    backgroundColor: colors.primary,
  },
  fabPressed: {
    opacity: 0.75,
  },
});
