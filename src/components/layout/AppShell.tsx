import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { useEffect } from 'react';
import SidebarNav from './SidebarNav';

export default function AppShell({ children }: { children?: ReactNode }) {
  const theme = useTheme();

  useEffect(() => {
    document.body.style.backgroundColor = theme.backgroundBasicColor1;
    const metaTags = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');
    metaTags.forEach(tag => tag.setAttribute('content', theme.backgroundBasicColor1));
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [theme.backgroundBasicColor1])

  return (
    <div
      className="h-screen flex"
      style={{ backgroundColor: theme.backgroundBasicColor3 }}
    >
      <SidebarNav />
      <div
        className="w-full lg:w-auto lg:flex-1 relative shadow-2xl lg:shadow-none flex flex-col overflow-y-auto overflow-x-hidden"
        style={{ backgroundColor: theme.backgroundBasicColor1 }}
      >
        {children ?? <Outlet />}
      </div>
    </div>
  );
}
