import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import numeral from 'numeral';
import dayjs from 'dayjs';
import { MdArrowForward } from 'react-icons/md';
import { useTheme } from '@/hooks/useTheme';
import { useAppSelector } from '@/store/hooks';
import { iconInfo } from '@/constants/categories';
import { HIDDEN_AMOUNT_TEXT } from '@/constants';
import type { Categories } from '@/types';

export default function Allocation({
  style,
  dateView = new Date(new Date().setHours(0, 0, 0, 0)),
  expense = false,
  customTitle,
}: {
  expense?: boolean;
  customTitle?: React.ReactNode;
  dateView: Date;
  style?: React.CSSProperties;
}) {
  const theme = useTheme();
  const activities = useAppSelector(state => state.activity.activities);
  const amountVisibility = useAppSelector(state => state.app.amountVisibility);
  const navigate = useNavigate();

  const data = useMemo(() => {
    const filtered = activities.filter(activity => {
      const d = new Date(activity.date);
      return (
        d.getMonth() === new Date(dateView).getMonth() &&
        d.getFullYear() === new Date(dateView).getFullYear() &&
        activity.expense === expense
      );
    });
    const allocation: Record<string, number> = {};
    let total = 0;
    for (const a of filtered) {
      allocation[a.category] = (allocation[a.category] || 0) + Number(a.amount);
      total += Number(a.amount);
    }
    return { total, allocation };
  }, [activities, dateView, expense]);

  return (
    <div style={style} className={customTitle ? '' : 'px-5'}>
      <div className={`flex items-center mb-3 ${customTitle ? 'px-4' : ''}`}>
        <div className="flex-1">
          {customTitle || (
            <p className="text-[13px] font-semibold" style={{ color: theme.textHintColor }}>
              {expense ? 'Expense' : 'Income'} allocation
            </p>
          )}
        </div>
        <button
          className="flex items-center gap-0.5 hover:opacity-70 transition-opacity"
          onClick={() => {
            navigate(`/allocation/${dayjs(dateView).format('YYYY-MM-DD')}/${expense ? 'expense' : 'income'}`);
          }}
        >
          <span className="text-[13px] font-semibold font-mono" style={{ color: theme.textPrimaryColor }}>
            {!amountVisibility ? HIDDEN_AMOUNT_TEXT : numeral(data.total).format('0,0')}
          </span>
          <MdArrowForward size={14} color={theme.textPrimaryColor} />
        </button>
      </div>

      {/* Bar */}
      <div
        className={`rounded-lg overflow-hidden h-2 flex mb-2 ${customTitle ? 'mx-4' : ''}`}
        style={{ backgroundColor: theme.backgroundBasicColor4 }}
      >
        {Object.keys(data.allocation).map(category => {
          const amount = data.allocation[category];
          const percentage = Number(numeral((amount / data.total) * 100).format('0.00').replace(/,/g, ''));
          const color = iconInfo(category as Categories).color;
          return (
            <div
              key={category}
              style={{ width: `${percentage}%`, backgroundColor: color }}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className={`flex flex-wrap gap-x-2.5 gap-y-1 ${customTitle ? 'mx-4' : ''}`}>
        {Object.keys(data.allocation).length > 0 ? (
          Object.keys(data.allocation).map(category => {
            const amount = data.allocation[category];
            const percentage = numeral((amount / data.total) * 100).format('0,0.00');
            const color = iconInfo(category as Categories).color;
            return (
              <div key={`${category}_dot`} className="flex items-center">
                <div
                  className="w-2 h-2 rounded-full mr-1"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[11px]" style={{ color: theme.textHintColor }}>
                  {category} ({percentage}%)
                </span>
              </div>
            );
          })
        ) : (
          <span className="text-[11px] italic" style={{ color: theme.textDisabledColor }}>
            No {expense ? 'expenses' : 'incomes'} this month
          </span>
        )}
      </div>
    </div>
  );
}
