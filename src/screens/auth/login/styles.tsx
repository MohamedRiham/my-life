import { StyleSheet } from 'react-native';

import { type AppColors } from '@/constants/Colors';
import { hp, wp } from '@/utils/responsive';

export const createLoginStyles = (colors: AppColors) => StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    gap: hp('3.8%'),
  },
  header: {
    gap: hp('1%'),
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 22,
  },
  form: {
    gap: hp('1.8%'),
  },
  footerContainer: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    gap: wp('2.5%'),
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: colors.divider,
  },
  footer: {
    color: colors.mutedText,
    flexShrink: 0,
    textAlign: 'center',
    fontSize: 15,
  },
  footerPrompt: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 0,
    gap: wp('1%'),
  },
  registerButton: {
    minHeight: 32,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  registerButtonPressed: {
    opacity: 0.7,
  },
  link: {
    color: colors.text === '#0F172A' ? '#1D4ED8' : colors.primary,
    fontSize: 15,
    fontWeight: '900',
    textDecorationLine: 'underline',
  },
});
