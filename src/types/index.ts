export type ActivityType = {
  id: number;
  expense: boolean;
  date: string;
  description: string;
  amount: number;
  category: string;
};

export type Categories =
  | 'BILLS'
  | 'CLOTHING'
  | 'EDUCATION'
  | 'ENTERTAINMENT'
  | 'FITNESS'
  | 'FOOD'
  | 'GIFTS'
  | 'HEALTH'
  | 'FURNITURE'
  | 'PET'
  | 'SHOPPING'
  | 'TRANSPORTATION'
  | 'TRAVEL'
  | 'OTHERS'
  | 'ALLOWANCE'
  | 'AWARD'
  | 'BONUS'
  | 'DIVIDEND'
  | 'INVESTMENT'
  | 'LOTTERY'
  | 'SALARY'
  | 'TIPS';

export type User = {
  id: string;
  email: string;
  name: string;
  hasPassword: boolean;
  createdAt: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type SettingsType = {
  appearanceType: 'LIGHT' | 'DARK';
  amountVisibility: boolean;
  autoSelectAppearance: boolean;
};

export type ThemeSchema = 'LIGHT' | 'DARK';

export interface ThemeColors {
  schema: ThemeSchema;
  backgroundBasicColor0: string;
  backgroundBasicColor1: string;
  backgroundBasicColor2: string;
  backgroundBasicColor3: string;
  backgroundBasicColor4: string;
  textBasicColor: string;
  textAlternateColor: string;
  textHintColor: string;
  textDisabledColor: string;
  textPrimaryColor: string;
  borderBasicColor2: string;
  borderBasicColor3: string;
  outlineColor: string;
  backgroundModalBackdropColor: string;
}
