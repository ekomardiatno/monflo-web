import { useNavigate, useLocation } from 'react-router-dom';
import {
  MdHome, MdAdd, MdRemove, MdBarChart, MdSettings,
} from 'react-icons/md';
import { useTheme } from '@/hooks/useTheme';
import { COLORS } from '@/constants';

const navItems = [
  { icon: MdHome, label: 'Home', path: '/' },
  { icon: MdAdd, label: 'Income', path: '/activity/new/income', color: COLORS.colorSuccess500 },
  { icon: MdRemove, label: 'Expense', path: '/activity/new/expense', color: COLORS.colorDanger500 },
  { icon: MdBarChart, label: 'Statistics', path: '/statistics', color: COLORS.colorPrimary500 },
  { icon: MdSettings, label: 'Settings', path: '/settings' },
];

export default function SidebarNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  return (
    <nav
      className="hidden lg:flex flex-col w-[260px] shrink-0 sticky top-0 h-screen border-r"
      style={{
        backgroundColor: theme.backgroundBasicColor0,
        borderColor: theme.borderBasicColor2,
      }}
    >
      {/* App name */}
      <div className="px-6 pt-7 pb-6">
        <h1
          className="text-[22px] font-bold tracking-tight"
          style={{ color: theme.textBasicColor }}
        >
          Monflo
        </h1>
        <p className="text-[12px] mt-0.5" style={{ color: theme.textHintColor }}>
          Money Flow Tracker
        </p>
      </div>

      {/* Nav items */}
      <div className="flex-1 px-3 space-y-1">
        {navItems.map(item => {
          const active = location.pathname === item.path;
          const iconColor = active
            ? COLORS.colorPrimary500
            : item.color || theme.textHintColor;

          return (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:opacity-80 active:scale-[0.98]"
              style={{
                backgroundColor: active ? `${COLORS.colorPrimary500}12` : 'transparent',
              }}
              onClick={() => navigate(item.path)}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: active
                    ? `${COLORS.colorPrimary500}18`
                    : `${iconColor}12`,
                }}
              >
                <item.icon size={20} color={iconColor} />
              </div>
              <span
                className="text-[14px] font-semibold"
                style={{
                  color: active ? COLORS.colorPrimary500 : theme.textBasicColor,
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
