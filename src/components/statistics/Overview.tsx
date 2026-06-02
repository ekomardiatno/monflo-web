import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import numeral from 'numeral';
import dayjs from 'dayjs';
import { MdArrowForward } from 'react-icons/md';
import { useTheme } from '@/hooks/useTheme';
import { useAppSelector } from '@/store/hooks';
import { COLORS, HIDDEN_AMOUNT_TEXT } from '@/constants';

export default function Overview({
  style,
  dateView = new Date(new Date().setHours(0, 0, 0, 0)),
}: {
  style?: React.CSSProperties;
  dateView: Date;
}) {
  const theme = useTheme();
  const activities = useAppSelector(state => state.activity.activities);
  const navigate = useNavigate();
  const amountVisibility = useAppSelector(state => state.app.amountVisibility);

  const overview = useMemo(() => {
    const filtered = activities.filter(a => {
      const d = new Date(a.date);
      return d.getMonth() === dateView.getMonth() && d.getFullYear() === dateView.getFullYear();
    });
    const income = filtered.filter(a => !a.expense).reduce((t, a) => t + a.amount, 0);
    const expense = filtered.filter(a => a.expense).reduce((t, a) => t + a.amount, 0);
    return { income, expense, total: income - expense };
  }, [activities, dateView]);

  const rows = [
    { label: 'Income', value: overview.income, color: COLORS.colorSuccess500, dot: 'rgba(16,185,129,.15)' },
    { label: 'Expense', value: overview.expense * -1, color: COLORS.colorDanger500, dot: 'rgba(244,63,94,.15)' },
  ];

  return (
    <div style={style} className="px-5">
      <div className="flex items-center mb-3">
        <p className="text-[13px] font-semibold flex-1" style={{ color: theme.textHintColor }}>
          Overview
        </p>
        <button
          className="flex items-center gap-0.5 hover:opacity-70 transition-opacity"
          onClick={() => navigate(`/history/${dayjs(dateView).format('YYYY-MM-DD')}`)}
        >
          <span className="text-[12px] font-medium" style={{ color: theme.textPrimaryColor }}>View all</span>
          <MdArrowForward size={14} color={theme.textPrimaryColor} />
        </button>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: theme.backgroundBasicColor0,
          boxShadow: theme.schema === 'DARK'
            ? '0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04)'
            : '0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02)',
        }}
      >
        {rows.map((row, i) => (
          <div key={row.label}>
            {i > 0 && <div className="mx-4" style={{ height: 1, backgroundColor: theme.borderBasicColor2 }} />}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: row.color }}
                />
                <span className="text-[13px]" style={{ color: theme.textHintColor }}>{row.label}</span>
              </div>
              <span className="text-[14px] font-semibold font-mono" style={{ color: theme.textBasicColor }}>
                {!amountVisibility ? HIDDEN_AMOUNT_TEXT : numeral(row.value).format('0,0')}
              </span>
            </div>
          </div>
        ))}

        {/* Total */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ backgroundColor: theme.backgroundBasicColor2 }}
        >
          <span className="text-[13px] font-semibold" style={{ color: theme.textBasicColor }}>Total</span>
          <span
            className="text-[15px] font-bold font-mono"
            style={{ color: overview.total >= 0 ? COLORS.colorSuccess500 : COLORS.colorDanger500 }}
          >
            {!amountVisibility ? HIDDEN_AMOUNT_TEXT : numeral(overview.total).format('0,0')}
          </span>
        </div>
      </div>
    </div>
  );
}
