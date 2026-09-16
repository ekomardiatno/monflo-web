import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { LIGHT_THEME, DARK_THEME } from '@/constants';
import type { ThemeColors } from '@/types';

export function useTheme(): ThemeColors {
  const appearanceType = useAppSelector(state => state.app.appearanceType);
  const autoSelectAppearance = useAppSelector(state => state.app.autoSelectAppearance);

  const [systemTheme, setSystemTheme] = useState<'LIGHT' | 'DARK'>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'DARK' : 'LIGHT'
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'DARK' : 'LIGHT');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const resolvedTheme = autoSelectAppearance ? systemTheme : appearanceType;

  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === 'DARK') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [resolvedTheme]);

  return useMemo(() => {
    return resolvedTheme === 'DARK' ? DARK_THEME : LIGHT_THEME;
  }, [resolvedTheme]);
}
