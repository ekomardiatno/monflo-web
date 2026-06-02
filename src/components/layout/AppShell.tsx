import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { useEffect } from 'react';

export default function AppShell({ children }: { children?: ReactNode }) {
  const theme = useTheme();

  useEffect(() => {
    document.body.style.backgroundColor = theme.backgroundBasicColor1;
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [theme.backgroundBasicColor3])

  return (
    <div
      className="min-h-full flex justify-center"
      style={{ backgroundColor: theme.backgroundBasicColor3 }}
    >
      <div
        className="w-full max-w-[430px] min-h-full relative shadow-2xl flex flex-col"
        style={{ backgroundColor: theme.backgroundBasicColor1 }}
      >
        {children ?? <Outlet />}
      </div>
    </div>
  );
}
