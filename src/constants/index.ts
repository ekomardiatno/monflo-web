import type { ThemeColors } from '@/types';

export const HIDDEN_AMOUNT_TEXT = '\u2022\u2022\u2022\u2022\u2022\u2022\u2022';

export const BACKUP_FILE_NAME = 'monager_backup';

export const CATEGORIES = {
  BILLS: 'BILLS',
  CLOTHING: 'CLOTHING',
  EDUCATION: 'EDUCATION',
  ENTERTAINMENT: 'ENTERTAINMENT',
  FITNESS: 'FITNESS',
  FOOD: 'FOOD',
  GIFTS: 'GIFTS',
  HEALTH: 'HEALTH',
  FURNITURE: 'FURNITURE',
  PET: 'PET',
  SHOPPING: 'SHOPPING',
  TRANSPORTATION: 'TRANSPORTATION',
  TRAVEL: 'TRAVEL',
  OTHERS: 'OTHERS',
  ALLOWANCE: 'ALLOWANCE',
  AWARD: 'AWARD',
  BONUS: 'BONUS',
  DIVIDEND: 'DIVIDEND',
  INVESTMENT: 'INVESTMENT',
  LOTTERY: 'LOTTERY',
  SALARY: 'SALARY',
  TIPS: 'TIPS',
} as const;

export const EXPENSE_CATEGORIES = [
  CATEGORIES.BILLS,
  CATEGORIES.CLOTHING,
  CATEGORIES.EDUCATION,
  CATEGORIES.ENTERTAINMENT,
  CATEGORIES.FITNESS,
  CATEGORIES.FOOD,
  CATEGORIES.GIFTS,
  CATEGORIES.HEALTH,
  CATEGORIES.FURNITURE,
  CATEGORIES.PET,
  CATEGORIES.SHOPPING,
  CATEGORIES.TRANSPORTATION,
  CATEGORIES.TRAVEL,
  CATEGORIES.INVESTMENT,
  CATEGORIES.OTHERS,
];

export const INCOME_CATEGORIES = [
  CATEGORIES.ALLOWANCE,
  CATEGORIES.AWARD,
  CATEGORIES.BONUS,
  CATEGORIES.DIVIDEND,
  CATEGORIES.INVESTMENT,
  CATEGORIES.SALARY,
  CATEGORIES.LOTTERY,
  CATEGORIES.TIPS,
  CATEGORIES.OTHERS,
];

export const COLORS = {
  // Primary — Indigo
  colorPrimary100: '#e0e7ff',
  colorPrimary200: '#c7d2fe',
  colorPrimary300: '#a5b4fc',
  colorPrimary400: '#818cf8',
  colorPrimary500: '#6366f1',
  colorPrimary600: '#4f46e5',
  colorPrimary700: '#4338ca',
  colorPrimary800: '#3730a3',
  colorPrimary900: '#312e81',

  // Success — Emerald
  colorSuccess100: '#d1fae5',
  colorSuccess200: '#a7f3d0',
  colorSuccess300: '#6ee7b7',
  colorSuccess400: '#34d399',
  colorSuccess500: '#10b981',
  colorSuccess600: '#059669',
  colorSuccess700: '#047857',
  colorSuccess800: '#065f46',
  colorSuccess900: '#064e3b',

  // Info — Cyan
  colorInfo100: '#cffafe',
  colorInfo200: '#a5f3fc',
  colorInfo300: '#67e8f9',
  colorInfo400: '#22d3ee',
  colorInfo500: '#06b6d4',
  colorInfo600: '#0891b2',
  colorInfo700: '#0e7490',
  colorInfo800: '#155e75',
  colorInfo900: '#164e63',

  // Warning — Amber
  colorWarning100: '#fef3c7',
  colorWarning200: '#fde68a',
  colorWarning300: '#fcd34d',
  colorWarning400: '#fbbf24',
  colorWarning500: '#f59e0b',
  colorWarning600: '#d97706',
  colorWarning700: '#b45309',
  colorWarning800: '#92400e',
  colorWarning900: '#78350f',

  // Danger — Rose
  colorDanger100: '#ffe4e6',
  colorDanger200: '#fecdd3',
  colorDanger300: '#fda4af',
  colorDanger400: '#fb7185',
  colorDanger500: '#f43f5e',
  colorDanger600: '#e11d48',
  colorDanger700: '#be123c',
  colorDanger800: '#9f1239',
  colorDanger900: '#881337',

  // Basic — Slate
  colorBasic000: '#ffffff',
  colorBasic100: '#f8fafc',
  colorBasic200: '#f1f5f9',
  colorBasic300: '#e2e8f0',
  colorBasic400: '#cbd5e1',
  colorBasic500: '#94a3b8',
  colorBasic600: '#64748b',
  colorBasic700: '#475569',
  colorBasic800: '#334155',
  colorBasic900: '#1e293b',
  colorBasic1000: '#0f172a',
  colorBasic1100: '#020617',
};

export const LIGHT_THEME: ThemeColors = {
  schema: 'LIGHT',
  backgroundBasicColor0: COLORS.colorBasic000,
  backgroundBasicColor1: COLORS.colorBasic100,
  backgroundBasicColor2: COLORS.colorBasic200,
  backgroundBasicColor3: COLORS.colorBasic300,
  backgroundBasicColor4: COLORS.colorBasic400,
  textBasicColor: COLORS.colorBasic900,
  textAlternateColor: COLORS.colorBasic100,
  textHintColor: COLORS.colorBasic600,
  textDisabledColor: COLORS.colorBasic400,
  textPrimaryColor: COLORS.colorPrimary500,
  borderBasicColor2: COLORS.colorBasic200,
  borderBasicColor3: COLORS.colorBasic300,
  outlineColor: 'rgba(100, 116, 139, 0.16)',
  backgroundModalBackdropColor: 'rgba(15, 23, 42, 0.5)',
};

export const DARK_THEME: ThemeColors = {
  schema: 'DARK',
  backgroundBasicColor0: '#131c2e',
  backgroundBasicColor1: COLORS.colorBasic1100,
  backgroundBasicColor2: COLORS.colorBasic1000,
  backgroundBasicColor3: COLORS.colorBasic900,
  backgroundBasicColor4: COLORS.colorBasic800,
  textBasicColor: COLORS.colorBasic200,
  textAlternateColor: COLORS.colorBasic900,
  textHintColor: COLORS.colorBasic500,
  textDisabledColor: COLORS.colorBasic700,
  textPrimaryColor: COLORS.colorPrimary400,
  borderBasicColor2: COLORS.colorBasic900,
  borderBasicColor3: COLORS.colorBasic800,
  outlineColor: COLORS.colorBasic700,
  backgroundModalBackdropColor: 'rgba(2, 6, 23, 0.65)',
};

export const GUTTER_SPACE = 15;
