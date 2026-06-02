import { useNavigate } from 'react-router-dom';
import {
  MdAdd, MdRemove, MdBarChart, MdSettings,
} from 'react-icons/md';
import { useTheme } from '@/hooks/useTheme';
import { COLORS } from '@/constants';

export default function ActionBar() {
  const navigate = useNavigate();
  const theme = useTheme();

  const actions = [
    {
      icon: MdAdd,
      label: 'Income',
      color: COLORS.colorSuccess500,
      bg: `${COLORS.colorSuccess500}18`,
      onPress: () => navigate('/activity/new/income'),
    },
    {
      icon: MdRemove,
      label: 'Expense',
      color: COLORS.colorDanger500,
      bg: `${COLORS.colorDanger500}18`,
      onPress: () => navigate('/activity/new/expense'),
    },
    {
      icon: MdBarChart,
      label: 'Stats',
      color: COLORS.colorPrimary500,
      bg: `${COLORS.colorPrimary500}18`,
      onPress: () => navigate('/statistics'),
    },
    {
      icon: MdSettings,
      label: 'Settings',
      color: theme.textHintColor,
      bg: theme.backgroundBasicColor3,
      onPress: () => navigate('/settings'),
    },
  ];

  return (
    <div
      className="fixed bottom-5 left-0 right-0 mx-auto z-20"
      style={{
        maxWidth: 'calc(430px - 40px)',
        width: 'calc(100% - 40px)',
      }}
    >
      <div
        className="rounded-2xl px-2 py-2 flex gap-1.5"
        style={{
          backgroundColor: theme.backgroundBasicColor0,
          boxShadow: theme.schema === 'DARK'
            ? '0 4px 24px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.06)'
            : '0 4px 24px rgba(0,0,0,.08), 0 0 0 1px rgba(0,0,0,.04)',
        }}
      >
        {actions.map(action => (
          <button
            key={action.label}
            className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all hover:opacity-80 active:scale-95 active:opacity-60"
            onClick={action.onPress}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: action.bg }}
            >
              <action.icon size={20} color={action.color} />
            </div>
            <span
              className="text-[10px] font-semibold"
              style={{ color: theme.textHintColor }}
            >
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
